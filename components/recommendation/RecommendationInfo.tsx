import React, { useContext, useEffect, useState } from 'react'
import { IRecommendationInfo } from '../../interface/recommendation'
import CoreImage from '../core/CoreImage'
import appConfig from '../../config/appConfig'
import QuotesWrapper from '../QuotesWrapper'
import CoreLink from '../core/CoreLink'
import { AnnotationIcon, BookmarkIcon as BookmarkIconOutline, DocumentAddIcon } from '@heroicons/react/outline'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { IUserInfo } from '../../interface/user'
import { IListDetail } from '../../interface/list'
import ApplicationContext from '../ApplicationContext'
import { isSessionUser } from '../../utils/user'
import AddRecommendationNote from './AddRecommendationNote'

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
  recommendationOwner?: IUserInfo
  showAddToList: boolean
  list?: IListDetail
  onAddToList?: () => void
}

const RecommendationInfo: React.FC<IRecommendationInfoProps> = props => {
  const { layout, source, recommendationInfo, recommendationOwner, list, showAddToList, onAddToList } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  const [note, setNote] = useState(recommendationInfo.notes || '')
  const [addNote, setAddNote] = useState(false)

  const sessionUser = isSessionUser(user, list?.owner || null)

  useEffect(() => {
    setNote(recommendationInfo.notes || '')
  }, [recommendationInfo.notes])

  if (layout === RecommendationInfoLayoutType.BLOCK) {
    return null
  }

  // TODO:
  /**
   * a way to show type
   * is 18+?
   */

  const renderNote = () => {
    if (source === RecommendationInfoSourceType.ADD) {
      if (!note) {
        return null
      }
      return <QuotesWrapper text={note} />
    }

    if (addNote) {
      return (
        <AddRecommendationNote
          note={note}
          list={list!}
          recommendationInfo={recommendationInfo}
          onCancel={() => setAddNote(false)}
          onSuccess={v => {
            setAddNote(false)
            setNote(v)
          }}
        />
      )
    }

    if (!!note) {
      return (
        <QuotesWrapper
          text={note}
          className="cursor-pointer"
          onClick={() => setAddNote(true)}
          allowEdit={sessionUser}
        />
      )
    } else {
      if (sessionUser) {
        return (
          <div
            className="text-typo-paragraphLight inline-flex items-center border-b cursor-pointer"
            onClick={() => setAddNote(true)}>
            <AnnotationIcon className="w-4 mr-1" />
            <span className="">Add a note</span>
          </div>
        )
      }

      return null
    }
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
        url={recommendationInfo.imageUrl}
        alt={`${recommendationInfo.title} recommendation on ${appConfig.global.app.name}`}
        className="w-20 h-20 shadow-listInfoImage"
      />
      <div className="ml-3 flex-grow">
        {source === RecommendationInfoSourceType.ADD ? (
          <span className="font-medium font-primary-medium">{recommendationInfo.title}</span>
        ) : (
          <CoreLink url={recommendationInfo.url} isExternal className="font-medium font-primary-medium">
            {recommendationInfo.title}
          </CoreLink>
        )}
        {recommendationOwner && <div className="text-typo-paragraphLight text-sm">by {recommendationOwner.name}</div>}
        <div className="text-sm mt-2">{renderNote()}</div>

        {showAddToList ? (
          <div className="flex items-center justify-end mt-2 lg:mt-3">
            <CoreButton
              label={'Add to list'}
              icon={getCTAIcon()}
              size={CoreButtonSize.SMALL}
              type={CoreButtonType.SOLID_PRIMARY}
              onClick={onAddToList}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default RecommendationInfo
