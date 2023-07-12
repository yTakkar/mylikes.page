import React, { useContext, useEffect, useState } from 'react'
import { IRecommendationInfo, RecommendationType } from '../../interface/recommendation'
import CoreImage from '../core/CoreImage'
import appConfig from '../../config/appConfig'
import QuotesWrapper from '../QuotesWrapper'
import CoreLink from '../core/CoreLink'
import { AnnotationIcon, PencilAltIcon, PlusIcon, XIcon } from '@heroicons/react/outline'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { IUserInfo } from '../../interface/user'
import { IListDetail } from '../../interface/list'
import ApplicationContext from '../ApplicationContext'
import { isSessionUser } from '../../utils/user'
import AddRecommendationNote from './AddRecommendationNote'
import { getProfilePageUrl } from '../../utils/routes'
import classNames from 'classnames'
import Tooltip from '../Tooltip'
import Alert from '../modal/Alert'
import {
  DocumentTextIcon,
  ExclamationIcon,
  MusicNoteIcon,
  ShoppingBagIcon,
  VideoCameraIcon,
} from '@heroicons/react/solid'
import { RECOMMENDATION_TYPE_DESCRIPTION_MAP } from '../../constants/constants'

export enum RecommendationInfoSourceType {
  LIST = 'LIST',
  ADD = 'ADD',
  MANAGE = 'MANAGE',
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
  list?: IListDetail
  onLinkClick?: () => void
  showAddToList?: boolean
  onAddToList?: () => void
  onManageClick?: () => void
  showRemoveFromList?: boolean
  onRemoveFromList?: () => Promise<void>
}

const RecommendationInfo: React.FC<IRecommendationInfoProps> = props => {
  const {
    layout,
    source,
    recommendationInfo,
    recommendationOwner,
    list,
    onLinkClick,
    showAddToList = false,
    onAddToList,
    onManageClick,
    showRemoveFromList = false,
    onRemoveFromList,
  } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    user,
    device: { isDesktop },
  } = applicationContext

  const [note, setNote] = useState(recommendationInfo.notes || '')
  const [addNote, setAddNote] = useState(false)

  const [showRemoveAlert, toggleRemoveAlert] = useState(false)
  const [removeLoading, toggleRemoveLoading] = useState(false)

  const sessionUser = isSessionUser(user, list?.owner || null)

  useEffect(() => {
    setNote(recommendationInfo.notes || '')
  }, [recommendationInfo.notes])

  if (layout === RecommendationInfoLayoutType.BLOCK) {
    return null
  }

  const handleRemove = () => {
    toggleRemoveLoading(true)
    onRemoveFromList!()
      .then(() => {
        toggleRemoveAlert(false)
      })
      .finally(() => {
        toggleRemoveLoading(false)
      })
  }

  const showCtaContainer = [showAddToList, showRemoveFromList, source === RecommendationInfoSourceType.MANAGE].some(
    v => !!v
  )

  const renderNote = () => {
    if (source === RecommendationInfoSourceType.ADD || source === RecommendationInfoSourceType.MANAGE) {
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

  const renderTypeIcon = () => {
    const className = 'w-4'
    if (recommendationInfo.type === RecommendationType.BLOG) {
      return <DocumentTextIcon className={className} />
    }
    if (recommendationInfo.type === RecommendationType.MUSIC) {
      return <MusicNoteIcon className={className} />
    }
    if (recommendationInfo.type === RecommendationType.VIDEO) {
      return <VideoCameraIcon className={className} />
    }
    if (recommendationInfo.type === RecommendationType.PRODUCT) {
      return <ShoppingBagIcon className={className} />
    }
    return null
  }

  const renderImage = () => {
    return (
      <CoreImage
        url={recommendationInfo.imageUrl}
        alt={`${recommendationInfo.title} recommendation on ${appConfig.global.app.name}`}
        className={classNames('w-20 h-20 min-h-20 min-w-20 shadow-listInfoImage', {
          'blur-sm': recommendationInfo.isAdult,
        })}
      />
    )
  }

  return (
    <>
      <div className="flex items-start mb-6 relative">
        <div className="relative">
          {source === RecommendationInfoSourceType.LIST ? (
            <CoreLink url={recommendationInfo.url} isExternal onClick={onLinkClick}>
              {renderImage()}
            </CoreLink>
          ) : (
            renderImage()
          )}
          {recommendationInfo.isAdult && (
            <div className="flex items-center absolute justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-clementine text-white p-1 rounded">
              <ExclamationIcon className="w-4 mr-1 font-medium font-primary-medium" />{' '}
              <span className="text-xs">NSFW</span>
            </div>
          )}
        </div>
        <div className="ml-3 flex-grow">
          <div
            className={classNames({
              'block max-w-[87%]': source === RecommendationInfoSourceType.LIST && isDesktop,
            })}>
            {source === RecommendationInfoSourceType.ADD ? (
              <span className="font-medium font-primary-medium">{recommendationInfo.title}</span>
            ) : (
              <CoreLink
                url={recommendationInfo.url}
                isExternal
                className="font-medium font-primary-medium"
                onClick={onLinkClick}>
                {recommendationInfo.title}
              </CoreLink>
            )}
          </div>

          <div className="text-typo-paragraphLight text-sm flex items-center">
            {recommendationOwner && (
              <span>
                by{' '}
                <CoreLink
                  url={getProfilePageUrl(recommendationOwner)}
                  className="text-typo-paragraphLight text-sm hover:underline">
                  {recommendationOwner.name}
                </CoreLink>
              </span>
            )}
            {recommendationInfo.type !== RecommendationType.OTHER && (
              <>
                &nbsp;•&nbsp;
                <Tooltip content={RECOMMENDATION_TYPE_DESCRIPTION_MAP[recommendationInfo.type]}>
                  <span>{renderTypeIcon()}</span>
                </Tooltip>
              </>
            )}
          </div>

          <div className="text-sm mt-2">{renderNote()}</div>

          {showCtaContainer && (
            <div
              className={classNames('flex items-center justify-end mt-2', {
                'mt-0 absolute right-1 top-1': source === RecommendationInfoSourceType.LIST && isDesktop,
              })}>
              {showAddToList ? (
                <CoreButton
                  label={'Add to list'}
                  icon={PlusIcon}
                  size={CoreButtonSize.SMALL}
                  type={CoreButtonType.SOLID_PRIMARY}
                  onClick={onAddToList}
                />
              ) : null}
              {showRemoveFromList ? (
                <Tooltip content="Remove from list">
                  <span>
                    <CoreButton
                      label={isDesktop ? null : 'Remove'}
                      icon={XIcon}
                      size={CoreButtonSize.SMALL}
                      type={CoreButtonType.OUTLINE_SECONDARY}
                      onClick={() => toggleRemoveAlert(true)}
                    />
                  </span>
                </Tooltip>
              ) : null}
              {source === RecommendationInfoSourceType.MANAGE ? (
                <CoreButton
                  label={'Edit'}
                  icon={PencilAltIcon}
                  size={CoreButtonSize.SMALL}
                  type={CoreButtonType.SOLID_PRIMARY}
                  onClick={onManageClick}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>

      {showRemoveAlert ? (
        <Alert
          dismissModal={() => toggleRemoveAlert(false)}
          title="Remove Confirmation"
          subTitle="Are you sure you want to do this? You cannot undo this."
          cta={{
            primary: {
              show: true,
              label: 'Remove',
              loading: removeLoading,
              onClick: handleRemove,
            },
            secondary: {
              show: true,
              label: 'Cancel',
              onClick: () => toggleRemoveAlert(false),
            },
          }}
        />
      ) : null}
    </>
  )
}

export default RecommendationInfo
