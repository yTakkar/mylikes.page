import React, { useContext, useEffect, useMemo, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import PageLoader from '../../components/loader/PageLoader'
import { prepareListPageSeo } from '../../utils/seo/pages/list'
import PageContainer from '../../components/PageContainer'
import { IListDetail, IListRecommendationInfo, ListVisibilityType } from '../../interface/list'
import {
  ChartBarIcon,
  CogIcon,
  DocumentDuplicateIcon,
  LightningBoltIcon,
  LinkIcon,
  PlusIcon,
  ShareIcon,
} from '@heroicons/react/outline'
import CoreDivider from '../../components/core/CoreDivider'
import { DesktopView } from '../../components/ResponsiveViews'
import RecommendationInfo, {
  RecommendationInfoLayoutType,
  RecommendationInfoSourceType,
} from '../../components/recommendation/RecommendationInfo'
import { addList, getListById, getListProfileInfoMap, listLists, updateList } from '../../firebase/store/list'
import { INITIAL_PAGE_BUILD_COUNT, PAGE_REVALIDATE_TIME } from '../../constants/constants'
import { get404PageUrl, getListPageUrl, getProfilePageUrl } from '../../utils/routes'
import { copyToClipboard, pluralize, vibrate } from '../../utils/common'
import NoContent from '../../components/NoContent'
import { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import ApplicationContext from '../../components/ApplicationContext'
import { PopupType } from '../../interface/popup'
import Loader, { LoaderType } from '../../components/loader/Loader'
import { LockClosedIcon, ReplyIcon } from '@heroicons/react/solid'
import { IUserInfo } from '../../interface/user'
import { isSessionUser } from '../../utils/user'
import NotFound from '../../components/NotFound'
import CoreLink from '../../components/core/CoreLink'
import { generateListId } from '../../utils/list'
import { toastError, toastSuccess } from '../../components/Toaster'
import Tooltip from '../../components/Tooltip'
import { revalidateUrls } from '../../utils/revalidate'
import classNames from 'classnames'
import { trackRecommendationClick } from '../../firebase/store/recommendationClickTracking'
import { trackAddToLibrary } from '../../firebase/store/addToLibraryTracking'
import useNativeShare from '../../hooks/useNativeShare'
import appConfig from '../../config/appConfig'
import Alert from '../../components/modal/Alert'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { insertArrayPositionItems } from '../../utils/array'
import { getFeaturedRecommendationPositions } from '../../utils/featuredAds'
import { addListBoostInvite } from '../../firebase/store/list-boost-invites'
import ShelfLists from '../../components/list/ShelfLists'
import useScrollToTop from '../../hooks/useScrollToTop'
import { isAdNotificationShown, setAdNotificationShown } from '../../utils/adNotification'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    listDetail: IListDetail
    profileInfoMap: Record<string, IUserInfo>
  }
}

const ListPage: NextPage<IProps> = (props: IProps) => {
  const router = useRouter()

  if (router.isFallback || !props.pageData) {
    return <PageLoader />
  }

  const applicationContext = useContext(ApplicationContext)
  const { user, methods, ads } = applicationContext

  const { listDetail: initialListDetail, profileInfoMap: _profileInfoMap } = props.pageData

  const profileInfoMap = {
    ..._profileInfoMap,
    [user?.email as string]: user || undefined,
  }

  const sessionUser = isSessionUser(user, initialListDetail.owner)

  const [listDetail, setListDetail] = useState(initialListDetail)
  const [loading, toggleLoading] = useState(false)

  const [showCloneAlert, toggleCloneAlert] = useState(false)
  const [cloneLoading, toggleCloneLoading] = useState(false)

  const [showBoostAlert, toggleBoostAlert] = useState(false)
  const [boostLoading, toggleBoostLoading] = useState(false)

  const shareUrl = `${appConfig.global.baseUrl}${getListPageUrl(listDetail.id)}`
  const shareText = appConfig.share.list.title
    .replace('{{LIST_NAME}}', listDetail.name)
    .replace('{{LIST_URL}}', `${shareUrl}`)

  const handleURLCopy = () => {
    copyToClipboard(shareUrl)
    appAnalytics.sendEvent({
      action: AnalyticsEventType.LIST_COPY_URL,
      extra: {
        shareText,
        shareUrl,
      },
    })
    toastSuccess('Link copied to clipboard!')
  }

  const { shouldshowNativeShare, handleNativeShare } = useNativeShare({
    onShareFail: handleURLCopy,
  })

  useScrollToTop()

  // useEffect(() => {
  //   const bannerShown = isAdNotificationShown()
  //   if (!bannerShown && !sessionUser) {
  //     methods.togglePopup(PopupType.AD_NOTIFICATION, {
  //       onSeen: () => {
  //         setAdNotificationShown(true)
  //       },
  //     })
  //   }
  // }, [sessionUser])

  useEffect(() => {
    if (initialListDetail) {
      setListDetail(initialListDetail)
    }
  }, [initialListDetail])

  const listRecommendations = listDetail.recommendations
  const hasRecommendations = listRecommendations.length > 0

  const refetchListDetail = async () => {
    if (!listDetail) {
      toggleLoading(true)
    }

    const data = await getListById(listDetail.id)
    if (data) {
      setListDetail(data)
    }
    toggleLoading(false)
  }

  const handleNewRecommendation = () => {
    methods.togglePopup(PopupType.ADD_RECOMMENDATION, {
      list: listDetail,
      onSuccess: () => {
        refetchListDetail()
      },
    })
  }

  const handleClone = () => {
    const process = async () => {
      toggleCloneLoading(true)

      try {
        const id = generateListId(listDetail.name)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, owner: _owner, ...rest } = listDetail
        const createdAt = new Date().getTime()
        await addList({
          id,
          ...rest,
          ownerEmail: user!.email,
          clonedListId: listDetail.id,
          createdAt: createdAt,
        })
        await revalidateUrls([getProfilePageUrl(user!.username)])
        trackAddToLibrary({
          listId: listDetail.id,
          clonedListId: id,
          clonedListName: listDetail.name,
          addedAt: createdAt,
        })
        toggleCloneAlert(false)
        toastSuccess('List cloned to your library!')
        appAnalytics.sendEvent({
          action: AnalyticsEventType.LIST_CLONE,
          extra: {
            originalListId: listDetail.id,
            listId: id,
            ownerEmail: user!.email,
            createdAt,
          },
        })
        vibrate()
        router.push(getProfilePageUrl(user!.username))
      } catch (e: any) {
        appAnalytics.captureException(e)
        toastError(`Failed to clone list!`)
        console.error('Error cloning list', e)
      } finally {
        toggleCloneLoading(false)
      }
    }

    process()
  }

  const handleAddToList = (listRecommendation: IListRecommendationInfo) => {
    if (!user) {
      methods.togglePopup(PopupType.LOGIN, {})
      return
    }

    if (!sessionUser) {
      methods.togglePopup(PopupType.ADD_TO_LIST, {
        listDetail,
        listRecommendation,
      })
      return
    }
  }

  const onRemoveFromList = async (index: number) => {
    try {
      const listRecommendation = listRecommendations[index]
      const updatedList = [...listRecommendations].filter((_, i) => i !== index)
      await updateList(listDetail.id, {
        recommendations: updatedList,
      })
      // invalidate profile page cache?
      await revalidateUrls([
        getListPageUrl(listDetail.id),
        // getProfilePageUrl(listDetail.owner!.username)
      ])
      toastSuccess('Removed from list!')
      appAnalytics.sendEvent({
        action: AnalyticsEventType.RECOMMENDATION_REMOVE,
        extra: {
          listId: listDetail.id,
          recommendationId: listRecommendation.id,
          url: listRecommendation.url,
          title: listRecommendation.title,
          type: listRecommendation.type,
        },
      })
      refetchListDetail()
    } catch (e) {
      appAnalytics.captureException(e)
      toastError('Failed to remove from list')
    }
  }

  const onLinkClick = async (listRecommendation: IListRecommendationInfo) => {
    const analyticsParams = {
      listId: listDetail.id,
      recommendationId: listRecommendation.id,
      url: listRecommendation.url,
      title: listRecommendation.title,
      type: listRecommendation.type,
    }

    if (!sessionUser) {
      trackRecommendationClick({
        listId: listDetail.id,
        listRecommendationId: listRecommendation.id,
      })
    }

    appAnalytics.sendEvent({
      action: AnalyticsEventType.RECOMMENDATION_VISIT,
      extra: analyticsParams,
    })
  }

  const handleRequestBoost = async () => {
    toggleBoostLoading(true)

    try {
      await addListBoostInvite({
        id: `${user!.email}-${listDetail.id}`,
        listId: listDetail.id,
        email: user!.email,
        createdAt: new Date().getTime(),
      })
      toggleBoostAlert(false)
      toastSuccess('Thanks for requesting boost! We will get back to you soon.')
    } catch (e: any) {
      appAnalytics.captureException(e)
      toastError(`Failed to request boost!`)
      console.error('Error requesting boost', e)
    } finally {
      toggleBoostLoading(false)
    }
  }

  const actions = [
    {
      label: (
        <div className="flex">
          <CogIcon className="w-4 mr-1" />
          Settings
        </div>
      ),
      tooltipContent: 'Manage list',
      onClick: () => {
        methods.togglePopup(PopupType.CREATE_LIST, {
          listDetail,
          onSuccess: () => {
            refetchListDetail()
          },
        })
      },
      show: sessionUser,
    },
    {
      label: (
        <div className="flex">
          <ChartBarIcon className="w-4 mr-1" />
          Analytics
        </div>
      ),
      tooltipContent: 'View list analytics',
      onClick: () => {
        methods.togglePopup(PopupType.LIST_ANALYTICS, {
          listDetail,
        })
      },
      show: sessionUser,
    },
    {
      label: (
        <div className="flex">
          <DocumentDuplicateIcon className="w-4 mr-1" />
          Clone List
        </div>
      ),
      tooltipContent: 'Clone this list to your library',
      onClick: () => {
        if (!user) {
          methods.togglePopup(PopupType.LOGIN, {})
          return
        }

        toggleCloneAlert(true)
      },
      show: !sessionUser,
    },
    {
      label: (
        <div className="flex">
          <ShareIcon className="w-4 mr-1" />
          Share
        </div>
      ),
      tooltipContent: 'Share this list',
      onClick: () => {
        handleNativeShare({
          text: shareText,
          url: shareUrl,
        })
        appAnalytics.sendEvent({
          action: AnalyticsEventType.LIST_SHARE,
          extra: {
            shareText,
            shareUrl,
          },
        })
      },
      show: shouldshowNativeShare,
    },
    {
      label: (
        <div className="flex">
          <LinkIcon className="w-4 mr-1" />
          Copy
        </div>
      ),
      tooltipContent: 'Copy list link',
      onClick: handleURLCopy,
      show: !shouldshowNativeShare,
    },
    {
      label: (
        <div className="flex">
          <LightningBoltIcon className="w-4 mr-1" />
          Boost
        </div>
      ),
      tooltipContent: 'Boost list',
      onClick: () => toggleBoostAlert(true),
      show: sessionUser,
    },
  ].filter(action => action.show)

  const featuredPositions = useMemo(() => {
    // if (sessionUser) {
    //   return []
    // }
    return getFeaturedRecommendationPositions(listDetail, ads.featuredListsShelf?.listInfos || [])
  }, [listDetail])

  const renderContent = () => {
    if (!sessionUser && listDetail.visibility === ListVisibilityType.PRIVATE) {
      return <NotFound />
    }

    if (loading) {
      return (
        <div>
          <Loader type={LoaderType.ELLIPSIS} />
        </div>
      )
    }

    const mappedRecommendations = listRecommendations.map((recommendationInfo, index) => {
      return (
        <div key={`${recommendationInfo.id}-${recommendationInfo.addedAt}`}>
          <RecommendationInfo
            layout={RecommendationInfoLayoutType.INLINE}
            source={RecommendationInfoSourceType.LIST}
            recommendationInfo={recommendationInfo}
            recommendationOwner={profileInfoMap[recommendationInfo.ownerEmail]}
            list={listDetail}
            onLinkClick={() => onLinkClick(recommendationInfo)}
            onAddToList={!sessionUser ? () => handleAddToList(recommendationInfo) : undefined}
            onRemoveFromList={sessionUser ? () => onRemoveFromList(index) : undefined}
            openLinkAd
          />
          <div className="w-full h-[1px] bg-gallery" />
        </div>
      )
    })

    return (
      <div className="px-3 lg:px-0">
        <div className="lg:my-8 lg:text-center">
          <div
            className={classNames('font-domaine-bold font-bold mb-1 lg:mb-3', [
              listDetail.name?.length >= 100 ? 'text-2xl lg:text-3xl' : 'text-3xl lg:text-5xl',
            ])}>
            {listDetail.name}
          </div>
          {listDetail.description && <div className="my-2 text-gray-800">{listDetail.description}</div>}
          <div className="text-typo-paragraphLight flex items-center lg:justify-center">
            by
            <div className="ml-1">
              <CoreLink url={getProfilePageUrl(listDetail.owner!.username)} className="underline">
                {listDetail.owner!.name}
              </CoreLink>
              <span> {sessionUser ? '(You)' : null}</span>
            </div>
            {listDetail.visibility === ListVisibilityType.PRIVATE && (
              <Tooltip content="This is a private list.">
                <span>
                  <LockClosedIcon className="w-5 ml-2" />
                </span>
              </Tooltip>
            )}
            {listDetail.clonedListId && (
              <Tooltip content={`This is a cloned list. Click to view the original list.`}>
                <button
                  onClick={() => {
                    appAnalytics.sendEvent({
                      action: AnalyticsEventType.LIST_CLONED_VIEW_ORIGINAL,
                      extra: {
                        originalListId: listDetail.clonedListId,
                        listId: listDetail.id,
                      },
                    })
                  }}>
                  <CoreLink url={getListPageUrl(listDetail.clonedListId!)}>
                    <ReplyIcon className="w-5 ml-2 transition-transform transform hover:scale-110" />
                  </CoreLink>
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            {actions.map((action, index) => {
              const isLast = index === actions.length - 1

              return (
                <Tooltip key={index} content={action.tooltipContent} disableOnMobile>
                  <span>
                    <button
                      className={classNames(
                        'bg-gallery font-semibold text-sm cursor-pointer py-1 px-2 rounded mr-1 lg:mr-2',
                        {
                          'mr-0': isLast,
                        }
                      )}
                      onClick={action.onClick}>
                      {action.label}
                    </button>
                  </span>
                </Tooltip>
              )
            })}
          </div>
          <DesktopView useCSS>
            <div className="text-typo-paragraphLight">
              {pluralize('recommendation', listRecommendations.length)} on this list
            </div>
          </DesktopView>
        </div>

        <CoreDivider className="my-6" />

        {sessionUser && (
          <div className="flex justify-end mb-5">
            <div
              className={classNames('bg-gallery font-semibold text-sm cursor-pointer py-1 px-2 rounded')}
              onClick={handleNewRecommendation}>
              <div className="flex">
                <PlusIcon className="w-4 mr-1" />
                Recommendation
              </div>
            </div>
          </div>
        )}

        <div>
          {hasRecommendations ? (
            insertArrayPositionItems(mappedRecommendations, featuredPositions)
          ) : (
            <NoContent
              message="This list is empty, it needs some recommendations."
              actions={[
                {
                  label: (
                    <div className="flex">
                      <PlusIcon className="w-5 mr-1" />
                      Add new
                    </div>
                  ),
                  size: CoreButtonSize.MEDIUM,
                  type: CoreButtonType.SOLID_PRIMARY,
                  onClick: handleNewRecommendation,
                },
              ]}
              imageClassName="w-full lg:w-[700px]"
            />
          )}
        </div>

        {ads.featuredListsShelf && (
          <div className="mt-10">
            <ShelfLists shelf={ads.featuredListsShelf} source="list" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <PageContainer>{renderContent()}</PageContainer>
      {showCloneAlert ? (
        <Alert
          dismissModal={() => toggleCloneAlert(false)}
          title="Clone this list?"
          subTitle="This will create a same list with all the recommendations in your personal library."
          cta={{
            primary: {
              show: true,
              label: 'Continue',
              loading: cloneLoading,
              onClick: handleClone,
            },
            secondary: {
              show: true,
              label: 'Cancel',
              onClick: () => toggleCloneAlert(false),
            },
          }}
        />
      ) : null}

      {showBoostAlert ? (
        <Alert
          dismissModal={() => toggleBoostAlert(false)}
          title="Boost your list 🚀"
          subTitle="Do you want your recommendations to appear in other lists too? You can boost your list to get more views."
          cta={{
            primary: {
              show: true,
              label: 'Request Invite',
              loading: boostLoading,
              onClick: handleRequestBoost,
            },
            secondary: {
              show: true,
              label: 'No Thanks',
              onClick: () => toggleBoostAlert(false),
            },
          }}
        />
      ) : null}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const lists = await listLists({
    limit: INITIAL_PAGE_BUILD_COUNT.LIST,
  })

  const paths: any = lists.map(list => ({
    params: {
      listId: list.id,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any

  const listDetail = await getListById(params.listId)

  if (!listDetail) {
    return {
      redirect: {
        destination: get404PageUrl(),
        permanent: false,
      },
    }
  }

  const profileInfoMap = await getListProfileInfoMap(listDetail)

  return {
    props: {
      pageData: {
        listDetail,
        profileInfoMap,
      },
      seo: prepareListPageSeo(listDetail),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: false,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
      ads: {
        stickyBanner: {
          show: {
            desktop: true,
            mobile: true,
          },
        },
      },
    },
    revalidate: PAGE_REVALIDATE_TIME.LIST,
  }
}

export default ListPage
