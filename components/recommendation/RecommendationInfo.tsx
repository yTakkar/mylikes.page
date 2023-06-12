import React from 'react'
import { IRecommendationInfo } from '../../interface/recommendation'
import CoreImage from '../core/CoreImage'
import appConfig from '../../config/appConfig'
import QuotesWrapper from '../QuotesWrapper'
import CoreLink from '../core/CoreLink'
import { AnnotationIcon, BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/outline'
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/solid'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'

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
    <div className="flex items-start mb-6 group">
      <CoreImage
        url="https://avatars.mylikes.page/avatars/croodles-neutral/harley.svg"
        alt={`name recommendation on ${appConfig.global.app.name}`}
        className="w-20 h-20 transform transition-transform group-hover:scale-105"
      />
      <div className="ml-3 flex-grow">
        <CoreLink url={'google.com'} isExternal className="font-medium font-primary-medium">
          The Ministry for the Future
        </CoreLink>
        <div className="text-typo-paragraphLight text-sm">Faiyaz</div>
        <div className="mt-2 lg:mt-3 text-sm">
          <div className="text-typo-paragraphLight inline-flex items-center border-b cursor-pointer">
            <AnnotationIcon className="w-4 mr-1" />
            <span className="">Add a note</span>
          </div>
          {/* <QuotesWrapper
            text={
              'This website is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.'
            }
          /> */}
        </div>

        <div className="flex items-center justify-end">
          <CoreButton
            label={'Add to list'}
            icon={BookmarkIconOutline}
            size={CoreButtonSize.SMALL}
            type={CoreButtonType.SOLID_SECONDARY}
          />
        </div>
      </div>
    </div>
  )
}

export default RecommendationInfo
