import React, { useEffect, useState } from 'react'
import { IListDetail } from '../../../interface/list'
import { IAddToListTrackingInfo } from '../../../interface/addToListTracking'
import { getAddToListTrackingsByList } from '../../../firebase/store/addToListTracking'
import Loader, { LoaderType } from '../../loader/Loader'
import { PresentationChartLineIcon } from '@heroicons/react/outline'
import CoreImage from '../../core/CoreImage'
import classNames from 'classnames'
import appConfig from '../../../config/appConfig'
import { getRelativeTime } from '../../../utils/date'
import CoreLink from '../../core/CoreLink'
import { getListPageUrl } from '../../../utils/routes'

interface IListAnalyticsAddedToListProps {
  listDetail: IListDetail
}

const ListAnalyticsAddedToList: React.FC<IListAnalyticsAddedToListProps> = props => {
  const { listDetail } = props

  const [loading, toggleLoading] = useState(false)
  const [trackingInfoList, setTrackingInfoList] = useState<IAddToListTrackingInfo[]>([])

  const fetchTrackingInfoList = async () => {
    toggleLoading(true)
    const list = await getAddToListTrackingsByList(listDetail.id)
    setTrackingInfoList(list)
    toggleLoading(false)
  }

  useEffect(() => {
    if (trackingInfoList.length === 0) {
      fetchTrackingInfoList()
    }
  }, [])

  const total = trackingInfoList.length

  const renderInfo = (info: IAddToListTrackingInfo) => {
    const recommendation = listDetail.recommendations.find(r => r.id === info.listRecommendationId)!

    return (
      <div>
        <div className="flex items-start mb-4 relative">
          <div className="relative">
            <CoreImage
              url={recommendation.imageUrl}
              alt={`${recommendation.title} recommendation on ${appConfig.global.app.name}`}
              className={classNames('w-11 h-11 min-h-11 min-w-11 shadow-listInfoImage', {})}
            />
          </div>
          <div className="ml-3 flex-grow">
            <div className="flex items-center">
              <div className="font-semibold">{recommendation?.title}</div>
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
        <div className="inline-flex mb-6">
          <span className="mt-[2px] mr-1">
            <PresentationChartLineIcon className="w-5" />
          </span>
          <span>Whenever someone adds recommendations from this list to their lists.</span>
        </div>

        <div className="flex items-center flex-col mb-6">
          <div className="font-bold">Total count</div>
          <div className="text-xl">{total}</div>
        </div>

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
