import React, { useContext, useEffect } from 'react'
import { IGlobalLayoutProps } from '../_app'
import PageContainer from '../../components/PageContainer'
import { GetStaticProps, NextPage } from 'next'
import { PAGE_REVALIDATE_TIME } from '../../constants/constants'
import { DesktopView, MobileView } from '../../components/ResponsiveViews'
import Snackbar from '../../components/header/Snackbar'
import BackTitle from '../../components/BackTitle'
import { prepareMostPopularRecommendationsPageSeo } from '../../utils/seo/pages/customLists'
import {
  getMostPopularRecommendations,
  getPopularRecommendationsProfileInfoMap,
} from '../../firebase/store/recommendationClickTracking'
import { IMostPopularRecommendation } from '../../interface/customList'
import RecommendationInfo, {
  RecommendationInfoLayoutType,
  RecommendationInfoSourceType,
} from '../../components/recommendation/RecommendationInfo'
import { IUserInfo } from '../../interface/user'
import NoContent from '../../components/NoContent'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { insertArrayPositionItems } from '../../utils/array'
import appConfig from '../../config/appConfig'
import useScrollToTop from '../../hooks/useScrollToTop'
import { isAdNotificationShown, setAdNotificationShown } from '../../utils/adNotification'
import { PopupType } from '../../interface/popup'
import ApplicationContext from '../../components/ApplicationContext'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    mostPopularRecommendations: IMostPopularRecommendation[]
    profileInfoMap: Record<string, IUserInfo>
  }
}

const MostPopularRecommendations: NextPage<IProps> = (props: IProps) => {
  const {
    pageData: { mostPopularRecommendations: _mostPopularRecommendations, profileInfoMap },
  } = props

  const applicationContext = useContext(ApplicationContext)
  const { methods } = applicationContext

  useScrollToTop()

  useEffect(() => {
    const bannerShown = isAdNotificationShown()
    if (!bannerShown) {
      methods.togglePopup(PopupType.AD_NOTIFICATION, {
        onSeen: () => {
          setAdNotificationShown(true)
        },
      })
    }
  }, [])

  const mostPopularRecommendations = _mostPopularRecommendations.filter(
    popularRecommendation => !!popularRecommendation.listRecommendation
  )

  const hasRecommendations = mostPopularRecommendations.length > 0

  const title = 'Most popular recommendations'

  const onLinkClick = (popularRecommendation: IMostPopularRecommendation) => {
    const basePayload = {
      listId: popularRecommendation.list?.id,
      recommendationId: popularRecommendation.listRecommendation?.id,
      url: popularRecommendation.listRecommendation?.url,
      title: popularRecommendation.listRecommendation?.title,
      type: popularRecommendation.listRecommendation?.type,
    }

    appAnalytics.sendEvent({
      action: AnalyticsEventType.RECOMMENDATION_VISIT,
      extra: basePayload,
    })
    appAnalytics.sendEvent({
      action: AnalyticsEventType.MOST_POPULAR_RECOMMENDATION_VISIT,
      extra: {
        mostRecommendationId: popularRecommendation.id,
        ...basePayload,
        count: popularRecommendation.clickCount,
      },
    })
  }

  const mappedRecommendations = mostPopularRecommendations.map(popularRecommendation => {
    const recommendationInfo = popularRecommendation.listRecommendation

    if (!recommendationInfo) {
      return null
    }

    return (
      <RecommendationInfo
        key={popularRecommendation.id}
        layout={RecommendationInfoLayoutType.INLINE}
        source={RecommendationInfoSourceType.LIST}
        recommendationInfo={recommendationInfo}
        recommendationOwner={profileInfoMap[recommendationInfo.ownerEmail]}
        list={popularRecommendation.list || undefined}
        onLinkClick={() => onLinkClick(popularRecommendation)}
        showListName
        openLinkAd
      />
    )
  })

  return (
    <div>
      <MobileView>
        <Snackbar title={title} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={title} />
          </DesktopView>

          <div className="mt-4">
            {/* <div className="flex items-center mb-4">
              <span className="inline">
                <InformationCircleIcon className="w-4" />
              </span>
              <span className="inline">
                Showing {appConfig.customLists.mostPopularRecommendationsCount} most visited recommendations across the
                platform. This list refreshes every
                {appConfig.analytics.cacheInvalidationTimeInSec / 60} minutes.
              </span>
            </div> */}

            <div>
              {hasRecommendations ? (
                insertArrayPositionItems(mappedRecommendations, {})
              ) : (
                <NoContent
                  message="Looks like there are no popular recommendations at the moment."
                  imageClassName="w-full lg:w-[700px]"
                />
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  const data = await getMostPopularRecommendations({
    limit: appConfig.customLists.mostPopularRecommendationsCount,
  })

  const profileInfoMap = await getPopularRecommendationsProfileInfoMap(data)

  return {
    props: {
      pageData: {
        mostPopularRecommendations: data,
        profileInfoMap,
      },
      seo: prepareMostPopularRecommendationsPageSeo(),
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
    revalidate: PAGE_REVALIDATE_TIME.CUSTOM.MOST_POPULAR_RECOMMENDATIONS,
  }
}

export default MostPopularRecommendations
