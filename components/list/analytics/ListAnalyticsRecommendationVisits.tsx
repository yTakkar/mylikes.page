import React, { useEffect, useState } from 'react'
import { IListDetail, IListRecommendationInfo } from '../../../interface/list'
import { IRecommendationClickInfo } from '../../../interface/recommendationClickTracking'
import { getRecommendationClickTrackingsByList } from '../../../firebase/store/recommendationClickTracking'
import Loader, { LoaderType } from '../../loader/Loader'
import CoreImage from '../../core/CoreImage'
import classNames from 'classnames'
import appConfig from '../../../config/appConfig'
import { pluralize } from '../../../utils/common'
import { BanIcon, PresentationChartLineIcon } from '@heroicons/react/outline'
import ls from 'localstorage-slim'
import appAnalytics from '../../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../../constants/analytics'
import { toastError } from '../../Toaster'

interface IListAnalyticsRecommendationVisitsProps {
  listDetail: IListDetail
}

interface ITrackingListRecommendationInfo extends IRecommendationClickInfo {
  listRecommendation: IListRecommendationInfo | null
}

const ListAnalyticsRecommendationVisits: React.FC<IListAnalyticsRecommendationVisitsProps> = props => {
  const { listDetail } = props

  const [loading, toggleLoading] = useState(false)
  const [trackingInfoList, setTrackingInfoList] = useState<IRecommendationClickInfo[]>([])

  const CACHE_KEY = `listAnalyticsRecommendationVisits-${listDetail.id}`

  const fetchTrackingInfoList = async () => {
    try {
      const cacheValue = ls.get(CACHE_KEY) as IRecommendationClickInfo[] | null
      if (cacheValue) {
        setTrackingInfoList(cacheValue)
        return
      }

      toggleLoading(true)
      const list = await getRecommendationClickTrackingsByList(listDetail.id)
      setTrackingInfoList(list)
      ls.set(CACHE_KEY, list, {
        ttl: appConfig.analytics.cacheInvalidationTimeInSec,
      })
      toggleLoading(false)
    } catch (e) {
      appAnalytics.captureException(e)
      toastError('Something went wrong!')
    }
  }

  useEffect(() => {
    appAnalytics.sendEvent({
      action: AnalyticsEventType.LIST_ANALYTICS_VIEW_RECOMMENDATIONS_VISIT,
      extra: {
        listId: listDetail.id,
      },
    })
    fetchTrackingInfoList()
  }, [])

  const totalRecommendationVisits = trackingInfoList.reduce((acc, cur) => acc + cur.clickCount, 0)

  const trackingListRecommendationInfos: ITrackingListRecommendationInfo[] = trackingInfoList
    .map(trackingInfo => {
      return {
        ...trackingInfo,
        listRecommendation:
          listDetail.recommendations.find(recommendation => recommendation.id === trackingInfo.listRecommendationId) ||
          null,
      }
    })
    .sort((a, b) => b.clickCount - a.clickCount)

  const renderTrackingListRecommendationInfo = (trackingListRecommendationInfo: ITrackingListRecommendationInfo) => {
    const { listRecommendation, clickCount } = trackingListRecommendationInfo
    return (
      <div>
        <div className="flex items-start mb-4 relative">
          <div className="relative">
            {listRecommendation ? (
              <CoreImage
                url={listRecommendation.imageUrl}
                alt={`${listRecommendation.title} recommendation on ${appConfig.global.app.name}`}
                className={classNames('w-11 h-11 min-h-11 min-w-11 shadow-listInfoImage', {})}
              />
            ) : (
              <BanIcon
                className={classNames('w-11 h-11 min-h-11 min-w-11', {
                  'text-gray-600': !listRecommendation,
                })}
              />
            )}
          </div>
          <div className="ml-3 flex-grow">
            <span
              className={classNames('font-medium font-primary-medium', {
                'text-gray-600 ital': !listRecommendation,
              })}>
              {listRecommendation ? listRecommendation.title : '<Deleted>'}
            </span>
            <div className="text-gray-600 text-sm flex items-center">{pluralize('visit', clickCount)}</div>
          </div>
        </div>
        <div className="border-b border-gray-200 my-2" />
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <Loader type={LoaderType.ELLIPSIS} />
    }

    return (
      <div>
        <div className="inline-flex mb-6">
          <span className="mt-[2px] mr-1">
            <PresentationChartLineIcon className="w-5" />
          </span>
          <span>
            Recommendation visits from this list. Updates every {appConfig.analytics.cacheInvalidationTimeInSec / 60}{' '}
            minutes.
          </span>
        </div>

        <div className="flex items-center flex-col mb-6">
          <div className="font-bold">Overall count</div>
          <div className="text-xl">{totalRecommendationVisits}</div>
        </div>

        <div>
          {trackingListRecommendationInfos.map((trackingListRecommendationInfo, index) => {
            return (
              <React.Fragment key={index}>
                {renderTrackingListRecommendationInfo(trackingListRecommendationInfo)}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }

  return <div>{renderContent()}</div>
}

export default ListAnalyticsRecommendationVisits
