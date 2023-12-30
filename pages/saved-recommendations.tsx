import React, { useContext, useEffect, useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import PageContainer from '../components/PageContainer'
import { IGlobalLayoutProps } from './_app'
import { prepareSavedRecommendationsPageSeo } from '../utils/seo/pages/savedRecommendations'
import { IRecommendationInfo } from '../interface/recommendation'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import BackTitle from '../components/BackTitle'
import { deleteSavedRecommendationById, listSavedRecommendationsByEmail } from '../firebase/store/saved-recommendations'
import ApplicationContext from '../components/ApplicationContext'
import { toastError, toastSuccess } from '../components/Toaster'
import Loader, { LoaderType } from '../components/loader/Loader'
import RecommendationInfo, {
  RecommendationInfoLayoutType,
  RecommendationInfoSourceType,
} from '../components/recommendation/RecommendationInfo'
import { PopupType } from '../interface/popup'
import NoContent from '../components/NoContent'
import { PlusIcon } from '@heroicons/react/solid'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import Alert from '../components/modal/Alert'
import CoreTextInput, { CoreTextInputType } from '../components/core/CoreInput'
import { SearchIcon } from '@heroicons/react/outline'
import Tooltip from '../components/Tooltip'
import { dynamicFuseJs } from '../components/dynamicModules'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Home: NextPage<IProps> = () => {
  const [initialRecommendations, setInitialRecommendations] = useState<IRecommendationInfo[]>([])
  const [recommendations, setRecommendations] = useState<IRecommendationInfo[]>([])

  const [loading, toggleLoading] = useState(false)

  const [recommendationToDelete, setRecommendationToDelete] = useState<IRecommendationInfo | null>(null)
  const [deleteLoading, toggleDeleteLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const applicationContext = useContext(ApplicationContext)
  const { user, methods } = applicationContext

  useEffect(() => {
    setRecommendations(initialRecommendations)
  }, [initialRecommendations])

  const fetchRecommendations = () => {
    if (!initialRecommendations?.length) {
      toggleLoading(true)
    }

    listSavedRecommendationsByEmail(user!.email)
      .then(recommendations => {
        setInitialRecommendations(recommendations.sort((a, b) => b.createdAt - a.createdAt))
      })
      .catch(e => {
        toastError('Error fetching saved recommendations')
        appAnalytics.captureException(e)
      })
      .finally(() => {
        toggleLoading(false)
      })
  }

  useEffect(() => {
    if (user) {
      fetchRecommendations()
    }
  }, [user])

  useEffect(() => {
    if (searchTerm) {
      handleSearch()
    } else {
      setRecommendations(initialRecommendations)
    }
  }, [searchTerm, initialRecommendations])

  const handleSearch = () => {
    dynamicFuseJs().then(mod => {
      const result = new mod.default(initialRecommendations, {
        keys: ['title', 'url'],
        includeScore: true,
        minMatchCharLength: 1,
      }).search(searchTerm)
      const results = result.filter(resultItem => resultItem.score! <= 0.5).map(resultItem => resultItem.item)
      setRecommendations(results)
    })
  }

  const handleManageEditClick = (recommendation: IRecommendationInfo) => {
    methods.togglePopup(PopupType.EDIT_RECOMMENDATION, {
      recommendation,
      onSuccess: () => {
        fetchRecommendations()
      },
    })
  }

  const handleDelete = async () => {
    if (deleteLoading) {
      return
    }

    toggleDeleteLoading(true)
    try {
      await deleteSavedRecommendationById(recommendationToDelete!.id)
      fetchRecommendations()
      toastSuccess('Recommendation deleted!')
      setRecommendationToDelete(null)
      appAnalytics.sendEvent({
        action: AnalyticsEventType.SAVED_RECOMMENDATION_REMOVE,
        extra: {
          id: recommendationToDelete!.id,
          url: recommendationToDelete!.url,
          ownerEmail: user!.email,
        },
      })
    } catch (e) {
      appAnalytics.captureException(e)
      console.error('list:delete:error', e)
      toastError('Failed to delete recommendation!')
    }
    toggleDeleteLoading(false)
  }

  const handleNewRecommendation = () => {
    methods.togglePopup(PopupType.EDIT_RECOMMENDATION, {
      onSuccess: () => {
        fetchRecommendations()
      },
    })
  }

  const renderContent = () => {
    if (loading) {
      return <Loader type={LoaderType.ELLIPSIS} />
    }

    return (
      <div className="px-3 py-3">
        {initialRecommendations.length > 0 ? (
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center flex-grow mr-2">
              <div className="flex-grow relative">
                <CoreTextInput
                  type={CoreTextInputType.TEXT}
                  placeholder="Search by title or URL"
                  value={searchTerm}
                  setValue={setSearchTerm}
                  autoComplete="off"
                  inputClassName={'!py-1 !pr-8 !pl-2'}
                />
                <SearchIcon className="w-5 absolute top-1/2 transform -translate-y-1/2 right-2 text-gray-500" />
              </div>
            </div>

            <Tooltip content="Save a new recommendation" disableOnMobile>
              <div
                className="bg-brand-primary text-white font-semibold cursor-pointer py-1 px-1 rounded "
                onClick={handleNewRecommendation}>
                <PlusIcon className="w-6" />
              </div>
            </Tooltip>
          </div>
        ) : null}

        {initialRecommendations.length === 0 ? (
          <NoContent message="You have no saved recommendations." imageClassName="w-full lg:w-[600px]" />
        ) : (
          recommendations.map((recommendationInfo, index) => {
            const isLast = index === initialRecommendations.length - 1
            return (
              <div key={`${recommendationInfo.id}`}>
                <RecommendationInfo
                  layout={RecommendationInfoLayoutType.INLINE}
                  source={RecommendationInfoSourceType.MANAGE}
                  recommendationInfo={recommendationInfo}
                  recommendationOwner={user!}
                  onManageEditClick={() => handleManageEditClick(recommendationInfo)}
                  onManageDeleteClick={() => {
                    setRecommendationToDelete(recommendationInfo)
                  }}
                />
                {!isLast && <div className="w-full h-[1px] bg-gallery" />}
              </div>
            )
          })
        )}
      </div>
    )
  }

  const title = `Saved recommendations ${initialRecommendations.length > 0 ? `(${initialRecommendations.length})` : ''}`

  return (
    <div>
      <MobileView>
        <Snackbar title={title} />
      </MobileView>

      <PageContainer>
        <DesktopView>
          <BackTitle title={title} />
        </DesktopView>

        {renderContent()}
      </PageContainer>

      {recommendationToDelete ? (
        <Alert
          dismissModal={() => setRecommendationToDelete(null)}
          title="Delete Confirmation"
          subTitle="Are you sure you want to do this? You cannot undo this."
          cta={{
            primary: {
              show: true,
              label: 'Delete',
              loading: deleteLoading,
              onClick: handleDelete,
            },
            secondary: {
              show: true,
              label: 'Cancel',
              onClick: () => setRecommendationToDelete(null),
            },
          }}
        />
      ) : null}
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareSavedRecommendationsPageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
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
  }
}

export default Home
