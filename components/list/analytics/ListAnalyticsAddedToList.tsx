import React, { useEffect, useState } from 'react'
import { IListDetail } from '../../../interface/list'
import { IAddToListTrackingInfo } from '../../../interface/addToListTracking'
import { getAddToListTrackingsByList } from '../../../firebase/store/addToListTracking'
import Loader, { LoaderType } from '../../loader/Loader'
import { BanIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import appConfig from '../../../config/appConfig'
import { getRelativeTime } from '../../../utils/date'
import CoreLink from '../../core/CoreLink'
import { getListPageUrl } from '../../../utils/routes'
import ls from 'localstorage-slim'
import appAnalytics from '../../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../../constants/analytics'
import { toastError } from '../../Toaster'
import ListAnalyticsCount from './ListAnalyticsCount'
import RecommendationTypeIcon from '../../recommendation/RecommendationTypeIcon'

interface IListAnalyticsAddedToListProps {
  listDetail: IListDetail
}

const ListAnalyticsAddedToList: React.FC<IListAnalyticsAddedToListProps> = props => {
  const { listDetail } = props

  const [loading, toggleLoading] = useState(false)
  const [trackingInfoList, setTrackingInfoList] = useState<IAddToListTrackingInfo[]>([])

  const CACHE_KEY = `listAnalyticsAddedToList-${listDetail.id}`

  const fetchTrackingInfoList = async () => {
    try {
      const cacheValue = ls.get(CACHE_KEY) as IAddToListTrackingInfo[] | null
      if (cacheValue) {
        setTrackingInfoList(cacheValue)
        return
      }

      toggleLoading(true)
      const list = await getAddToListTrackingsByList(listDetail.id)
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
      action: AnalyticsEventType.LIST_ANALYTICS_VIEW_ADD_TO_LIST,
      extra: {
        listId: listDetail.id,
      },
    })
    fetchTrackingInfoList()
  }, [])

  const total = trackingInfoList.length

  const renderInfo = (info: IAddToListTrackingInfo) => {
    const recommendation = listDetail.recommendations.find(r => r.id === info.listRecommendationId)

    return (
      <div>
        <div className="flex items-start mb-4 relative">
          <div className="relative">
            {recommendation ? (
              <div className="w-10 h-10 min-w-10 min-h-10">
                <RecommendationTypeIcon recommendation={recommendation} source="recommendation" />
              </div>
            ) : (
              <BanIcon
                className={classNames('w-10 h-10 min-h-10 min-w-10', {
                  'text-gray-600': !recommendation,
                })}
              />
            )}
          </div>
          <div className="ml-3 flex-grow">
            <div className="flex items-center">
              <div className="font-semibold">{recommendation ? recommendation.title : '<Deleted>'}</div>
              <div className="mx-1">added to</div>
              <CoreLink url={getListPageUrl(info.targetListId)} isExternal>
                <div className="font-semibold underline">{info.targetListName}</div>
              </CoreLink>
            </div>
            <div className=" text-gray-600 text-sm flex items-center">
              {getRelativeTime(new Date(info.addedAt as any).toISOString())}
            </div>
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
        <ListAnalyticsCount
          count={total}
          infoText="Whenever someone adds recommendations from this list to their lists."
        />

        <div>
          {trackingInfoList.map((list, index) => {
            return <React.Fragment key={index}>{renderInfo(list)}</React.Fragment>
          })}
        </div>
      </div>
    )
  }

  return <div>{renderContent()}</div>
}

export default ListAnalyticsAddedToList
