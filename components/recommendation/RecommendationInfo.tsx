import React from 'react'
import { IRecommendationInfo } from '../../interface/recommendation'
import CoreImage from '../core/CoreImage'
import appConfig from '../../config/appConfig'
import QuotesWrapper from '../QuotesWrapper'
import CoreLink from '../core/CoreLink'
import { AnnotationIcon, BookmarkIcon as BookmarkIconOutline, DocumentAddIcon } from '@heroicons/react/outline'
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/solid'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'

export enum RecommendationInfoSourceType {
  LIST = 'LIST',
  ADD = 'ADD',
}

export enum RecommendationInfoLayoutType {
  BLOCK = 'BLOCK',
  INLINE = 'INLINE',
}

interface IRecommendationInfoProps {
  layout: RecommendationInfoLayoutType
  source: RecommendationInfoSourceType
  recommendationInfo: IRecommendationInfo
  onAddToList?: () => void
}

const RecommendationInfo: React.FC<IRecommendationInfoProps> = props => {
  const { layout, source, onAddToList } = props

  if (layout === RecommendationInfoLayoutType.BLOCK) {
    return null
  }

  const notes =
    'This website is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.'

  // TODO:
  /**
   * a way to show type
   * is 18+?
   */

  const renderNote = () => {
    if (source === RecommendationInfoSourceType.ADD) {
      return (
        <div className="mt-1">
          <QuotesWrapper text={notes} />
        </div>
      )
    }

    return (
      <div className="mt-2">
        {!!notes ? (
          <QuotesWrapper text={notes} />
        ) : (
          <div className="text-typo-paragraphLight inline-flex items-center border-b cursor-pointer">
            <AnnotationIcon className="w-4 mr-1" />
            <span className="">Add a note</span>
          </div>
        )}
      </div>
    )
  }

  const getCTAIcon = () => {
    if (source === RecommendationInfoSourceType.ADD) {
      return DocumentAddIcon
    }
    return BookmarkIconOutline
  }

  return (
    <div className="flex items-start mb-6">
      <CoreImage
        url="https://avatars.mylikes.page/avatars/croodles-neutral/harley.svg"
        alt={`name recommendation on ${appConfig.global.app.name}`}
        className="w-20 h-20"
      />
      <div className="ml-3 flex-grow">
        {source === RecommendationInfoSourceType.ADD ? (
          <span className="font-medium font-primary-medium">The Ministry for the Future</span>
        ) : (
          <CoreLink url={'google.com'} isExternal className="font-medium font-primary-medium">
            The Ministry for the Future
          </CoreLink>
        )}
        {source === RecommendationInfoSourceType.ADD ? null : (
          <div className="text-typo-paragraphLight text-sm">Faiyaz</div>
        )}
        <div className="text-sm">{renderNote()}</div>

        <div className="flex items-center justify-end mt-2 lg:mt-3">
          <CoreButton
            label={'Add to list'}
            icon={getCTAIcon()}
            size={CoreButtonSize.SMALL}
            type={CoreButtonType.SOLID_PRIMARY}
            onClick={() => onAddToList?.()}
          />
        </div>
      </div>
    </div>
  )
}

export default RecommendationInfo
