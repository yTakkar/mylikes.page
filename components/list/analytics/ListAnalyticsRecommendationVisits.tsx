import React, { useEffect, useState } from 'react'
import { IListDetail, IListRecommendationInfo } from '../../../interface/list'
import { IRecommendationClickInfo } from '../../../interface/recommendationClickTracking'
import { getRecommendationClickTrackingsByList } from '../../../firebase/store/recommendationClickTracking'
import Loader, { LoaderType } from '../../loader/Loader'
import classNames from 'classnames'
import appConfig from '../../../config/appConfig'
import { pluralize } from '../../../utils/common'
import { BanIcon } from '@heroicons/react/outline'
import ls from 'localstorage-slim'
import appAnalytics from '../../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../../constants/analytics'
import { toastError } from '../../Toaster'
import ListAnalyticsCount from './ListAnalyticsCount'
import RecommendationTypeIcon from '../../recommendation/RecommendationTypeIcon'

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
              <div className="w-10 h-10 min-w-10 min-h-10">
                <RecommendationTypeIcon recommendation={listRecommendation} source="recommendation" />
              </div>
            ) : (
              <BanIcon
                className={classNames('w-10 h-10 min-h-10 min-w-10', {
                  'text-gray-600': !listRecommendation,
                })}
              />
            )}
          </div>
          <div className="ml-3 flex-grow">
            <span
              className={classNames('font-semibold', {
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
        <ListAnalyticsCount count={totalRecommendationVisits} infoText="Recommendation visits from this list." />

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
