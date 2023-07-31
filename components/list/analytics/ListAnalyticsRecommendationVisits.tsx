import React, { useEffect, useState } from 'react'
import { IListDetail, IListRecommendationInfo } from '../../../interface/list'
import { IRecommendationClickInfo } from '../../../interface/recommendationClickTracking'
import { getRecommendationClickTrackingsByList } from '../../../firebase/store/recommendationClickTracking'
import Loader, { LoaderType } from '../../loader/Loader'
import CoreImage from '../../core/CoreImage'
import classNames from 'classnames'
import appConfig from '../../../config/appConfig'
import { pluralize } from '../../../utils/common'
import { PresentationChartLineIcon } from '@heroicons/react/outline'

interface IListAnalyticsRecommendationVisitsProps {
  listDetail: IListDetail
}

interface ITrackingListRecommendationInfo extends IRecommendationClickInfo {
  listRecommendation: IListRecommendationInfo
}

const ListAnalyticsRecommendationVisits: React.FC<IListAnalyticsRecommendationVisitsProps> = props => {
  const { listDetail } = props

  const [loading, toggleLoading] = useState(false)
  const [trackingInfoList, setTrackingInfoList] = useState<IRecommendationClickInfo[]>([])

  const fetchTrackingInfoList = async () => {
    toggleLoading(true)
    const list = await getRecommendationClickTrackingsByList(listDetail.id)
    setTrackingInfoList(list)
    toggleLoading(false)
  }

  useEffect(() => {
    if (trackingInfoList.length === 0) {
      fetchTrackingInfoList()
    }
  }, [])

  const totalRecommendationVisits = trackingInfoList.reduce((acc, cur) => acc + cur.clickCount, 0)

  const trackingListRecommendationInfos: ITrackingListRecommendationInfo[] = trackingInfoList
    .map(trackingInfo => {
      return {
        ...trackingInfo,
        listRecommendation: listDetail.recommendations.find(
          recommendation => recommendation.id === trackingInfo.listRecommendationId
        )!,
      }
    })
    .sort((a, b) => b.clickCount - a.clickCount)

  const renderTrackingListRecommendationInfo = (trackingListRecommendationInfo: ITrackingListRecommendationInfo) => {
    const { listRecommendation, clickCount } = trackingListRecommendationInfo
    return (
      <div>
        <div className="flex items-start mb-4 relative">
          <div className="relative">
            <CoreImage
              url={listRecommendation.imageUrl}
              alt={`${listRecommendation.title} recommendation on ${appConfig.global.app.name}`}
              className={classNames('w-11 h-11 min-h-11 min-w-11 shadow-listInfoImage', {})}
            />
          </div>
          <div className="ml-3 flex-grow">
            <span className="font-medium font-primary-medium">{listRecommendation.title}</span>
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
          <span>Recommendation visits from this list.</span>
        </div>

        <div className="flex items-center flex-col mb-6">
          <div className="font-bold">Total count</div>
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
