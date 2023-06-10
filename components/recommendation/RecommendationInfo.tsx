import React from 'react'
import { IRecommendationInfo } from '../../interface/recommendation'
import CoreImage from '../core/CoreImage'
import appConfig from '../../config/appConfig'

export enum RecommendationInfoLayoutType {
  BLOCK = 'BLOCK',
  INLINE = 'INLINE',
}

interface IRecommendationInfoProps {
  // recommendationInfo: IRecommendationInfo
  layout: RecommendationInfoLayoutType
}

const RecommendationInfo: React.FC<IRecommendationInfoProps> = props => {
  const { layout } = props

  if (layout === RecommendationInfoLayoutType.BLOCK) {
    return null
  }

  /**
   * show title
   * show owner if list.owner !== owner else description
   * original ownner - when adding to your library
   * show notes - if present
   * show add to your library - if you're not the owner of the list
   * a way to show type
   */

  return (
    <div>
      <CoreImage
        url="https://avatars.mylikes.page/avatars/croodles-neutral/harley.svg"
        alt={`name recommendation on ${appConfig.global.app.name}`}
        className="w-20 h-20"
      />
      <div>
        <div>The Metamorphosis</div>
        {/* <div>Some description</div> */}
      </div>
    </div>
  )
}

export default RecommendationInfo
