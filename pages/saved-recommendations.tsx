import React, { useContext, useEffect, useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import PageContainer from '../components/PageContainer'
import { IGlobalLayoutProps } from './_app'
import { prepareSavedRecommendationsPageSeo } from '../utils/seo/pages/savedRecommendations'
import { IRecommendationInfo } from '../interface/recommendation'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import BackTitle from '../components/BackTitle'
import { listSavedRecommendationsByEmail } from '../firebase/store/saved-recommendations'
import ApplicationContext from '../components/ApplicationContext'
import { toastError } from '../components/Toaster'
import Loader, { LoaderType } from '../components/loader/Loader'
import RecommendationInfo, {
  RecommendationInfoLayoutType,
  RecommendationInfoSourceType,
} from '../components/recommendation/RecommendationInfo'
import { PopupType } from '../interface/popup'
import NoContent from '../components/NoContent'
import { PlusIcon } from '@heroicons/react/solid'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Home: NextPage<IProps> = () => {
  const [recommendations, setRecommendations] = useState<IRecommendationInfo[]>([])
  const [loading, toggleLoading] = useState(false)

  const applicationContext = useContext(ApplicationContext)
  const { user, methods } = applicationContext

  const fetchRecommendations = () => {
    toggleLoading(true)
    listSavedRecommendationsByEmail(user!.email)
      .then(recommendations => {
        setRecommendations(recommendations)
      })
      .catch(() => {
        toastError('Error fetching saved recommendations')
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

  const handleManageClick = (recommendation: IRecommendationInfo) => {
    methods.togglePopup(PopupType.EDIT_RECOMMENDATION, {
      recommendation,
      onSuccess: () => {
        fetchRecommendations()
      },
    })
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
        <div className="flex items-center justify-end mb-4">
          <div
            className="bg-gallery font-medium cursor-pointer py-2 px-3 rounded font-primary-medium"
            onClick={handleNewRecommendation}>
            <div className="flex">
              <PlusIcon className="w-6 mr-1" />
              Add new
            </div>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <NoContent message="You have no saved recommendations." imageClassName="w-full lg:w-[600px]" />
        ) : (
          recommendations.map(recommendationInfo => {
            return (
              <RecommendationInfo
                key={`${recommendationInfo.id}`}
                layout={RecommendationInfoLayoutType.INLINE}
                source={RecommendationInfoSourceType.MANAGE}
                recommendationInfo={recommendationInfo}
                recommendationOwner={user!}
                showAddToList={false}
                onManageClick={() => handleManageClick(recommendationInfo)}
              />
            )
          })
        )}
      </div>
    )
  }

  const title = `Saved recommendations ${recommendations.length > 0 ? `(${recommendations.length})` : ''}`

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
    },
  }
}

export default Home
