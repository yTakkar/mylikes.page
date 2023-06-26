import React, { useContext, useState } from 'react'
import { IGlobalLayoutProps } from '../_app'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import PageLoader from '../../components/loader/PageLoader'
import { prepareListPageSeo } from '../../utils/seo/pages/list'
import PageContainer from '../../components/PageContainer'
import { IListDetail, IListRecommendationInfo, ListVisibilityType } from '../../interface/list'
import { LibraryIcon, PlusIcon } from '@heroicons/react/outline'
import CoreDivider from '../../components/core/CoreDivider'
import { DesktopView } from '../../components/ResponsiveViews'
import RecommendationInfo, {
  RecommendationInfoLayoutType,
  RecommendationInfoSourceType,
} from '../../components/recommendation/RecommendationInfo'
import { getListById, getListProfileInfoMap, listLists } from '../../firebase/store/list'
import { INITIAL_PAGE_BUILD_COUNT, PAGE_REVALIDATE_TIME } from '../../constants/constants'
import { get404PageUrl, getProfilePageUrl } from '../../utils/routes'
import { pluralize } from '../../utils/common'
import NoContent from '../../components/NoContent'
import { CoreButtonSize, CoreButtonType } from '../../components/core/CoreButton'
import ApplicationContext from '../../components/ApplicationContext'
import { PopupType } from '../../interface/popup'
import Loader, { LoaderType } from '../../components/loader/Loader'
import { LockClosedIcon } from '@heroicons/react/solid'
import { IUserInfo } from '../../interface/user'
import { isSessionUser } from '../../utils/user'
import NotFound from '../../components/NotFound'
import CoreLink from '../../components/core/CoreLink'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    listDetail: IListDetail
    profileInfoMap: Record<string, IUserInfo>
  }
}

const List: NextPage<IProps> = (props: IProps) => {
  const router = useRouter()

  if (router.isFallback || !props.pageData) {
    return <PageLoader />
  }

  const applicationContext = useContext(ApplicationContext)
  const { user, methods } = applicationContext

  const { listDetail: initialListDetail, profileInfoMap } = props.pageData

  const sessionUser = isSessionUser(user, initialListDetail.owner)

  const [listDetail, setListDetail] = useState(initialListDetail)
  const [loading, toggleLoading] = useState(false)

  const hasRecommendations = listDetail.recommendations.length > 0

  const refetchListDetail = async () => {
    toggleLoading(true)
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

  // TODO:
  const handleAddToLibrary = () => {
    console.log('Add to library')
  }

  const handleAddToList = (listRecommendation: IListRecommendationInfo) => {
    if (!sessionUser) {
      methods.togglePopup(PopupType.ADD_TO_LIST, {
        listRecommendation,
      })
      return
    }
  }

  const actions = [
    {
      label: 'List Settings',
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
          <PlusIcon className="w-4 mr-1" />
          Add a recommendation
        </div>
      ),
      onClick: handleNewRecommendation,
      show: sessionUser,
    },
    {
      label: (
        <div className="flex">
          <LibraryIcon className="w-4 mr-1" />
          Add to your library
        </div>
      ),
      onClick: handleAddToLibrary,
      show: !sessionUser,
    },
  ]

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

    return (
      <div className="px-3 lg:px-0">
        <div className="lg:my-8 lg:text-center">
          <div className="font-domaine-bold font-bold text-3xl mb-1 lg:mb-3 lg:text-5xl">{listDetail.name}</div>
          {listDetail.description && <div className="my-2 text-gray-800">{listDetail.description}</div>}
          <div className="text-typo-paragraphLight flex items-center lg:justify-center">
            by
            <CoreLink url={getProfilePageUrl(listDetail.owner)} className="ml-1">
              {listDetail.owner.name} {sessionUser ? '(You)' : null}
            </CoreLink>{' '}
            {listDetail.visibility === ListVisibilityType.PRIVATE && <LockClosedIcon className="w-4 ml-1" />}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            {actions.map((action, index) => {
              if (!action.show) {
                return null
              }

              return (
                <div
                  key={index}
                  className="bg-gallery font-medium text-sm cursor-pointer py-1 px-2 rounded-lg font-primary-medium mr-2"
                  onClick={action.onClick}>
                  {action.label}
                </div>
              )
            })}
          </div>
          <DesktopView useCSS>
            <div className="text-typo-paragraphLight">
              {pluralize('recommendation', listDetail.recommendations.length)} on this list
            </div>
          </DesktopView>
        </div>

        <CoreDivider className="my-8" />

        <div>
          {hasRecommendations ? (
            listDetail.recommendations.map(recommendationInfo => (
              <RecommendationInfo
                key={`${recommendationInfo.id}-${recommendationInfo.addedAt}`}
                layout={RecommendationInfoLayoutType.INLINE}
                source={RecommendationInfoSourceType.LIST}
                recommendationInfo={recommendationInfo}
                recommendationOwner={profileInfoMap[recommendationInfo.ownerEmail]}
                list={listDetail}
                showAddToList={!sessionUser}
                onAddToList={() => handleAddToList(recommendationInfo)}
              />
            ))
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
      </div>
    )
  }

  return <PageContainer>{renderContent()}</PageContainer>
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
    },
    revalidate: PAGE_REVALIDATE_TIME.LIST,
  }
}

export default List
