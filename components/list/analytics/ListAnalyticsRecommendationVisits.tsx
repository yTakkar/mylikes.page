import React, { useEffect, useState } from 'react'
import { IListDetail, IListRecommendationInfo } from '../../../interface/list'
import { IRecommendationClickInfo } from '../../../interface/recommendationClickTracking'
import { getRecommendationClickTrackingsByList } from '../../../firebase/store/recommendationClickTracking'
import Loader, { LoaderType } from '../../loader/Loader'
import CoreImage from '../../core/CoreImage'
import classNames from 'classnames'
import appConfig from '../../../config/appConfig'
import { pluralize } from '../../../utils/common'

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
          <div className="text-typo-paragraphLight text-sm flex items-center">{pluralize('visit', clickCount)}</div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <Loader type={LoaderType.ELLIPSIS} />
    }

    return (
      <div>
        <div className="flex items-center flex-col mb-6">
          <div className="font-bold">Overall visits</div>
          <div className="text-xl">{totalRecommendationVisits}</div>
        </div>

        <div>
          {trackingListRecommendationInfos.map(trackingListRecommendationInfo => {
            return (
              <React.Fragment key={trackingListRecommendationInfo.id}>
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
