import React, { useContext, useEffect, useState } from 'react'
import { IRecommendationInfo } from '../../interface/recommendation'
import CoreImage from '../core/CoreImage'
import appConfig from '../../config/appConfig'
import QuotesWrapper from '../QuotesWrapper'
import CoreLink from '../core/CoreLink'
import { AnnotationIcon, PencilAltIcon, PlusIcon, TrashIcon, XIcon } from '@heroicons/react/outline'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { IUserInfo } from '../../interface/user'
import { IListDetail, IListRecommendationInfo } from '../../interface/list'
import ApplicationContext from '../ApplicationContext'
import { isSessionUser } from '../../utils/user'
import AddRecommendationNote from './AddRecommendationNote'
import { getListPageUrl, getProfilePageUrl } from '../../utils/routes'
import classNames from 'classnames'
import Tooltip from '../Tooltip'
import Alert from '../modal/Alert'
import { ExclamationIcon } from '@heroicons/react/solid'
import FeaturedLabel from '../FeaturedLabel'
import { getRelativeTime } from '../../utils/date'
import dayjs from 'dayjs'
import { capitalize } from '../../utils/common'
import { RECOMMENDATION_FALLBACK_IMAGE_URL } from '../../constants/constants'
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

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
  onAddToList?: () => void
  onManageEditClick?: () => void
  onManageDeleteClick?: () => void
  onRemoveFromList?: () => Promise<void>
  sponsored?: boolean
  loading?: boolean
  disabled?: boolean
  showListName?: boolean
}

const RecommendationInfo: React.FC<IRecommendationInfoProps> = props => {
  const {
    layout,
    source,
    recommendationInfo,
    recommendationOwner,
    list,
    onLinkClick,
    onAddToList,
    onManageDeleteClick,
    onManageEditClick,
    onRemoveFromList,
    sponsored = false,
    loading = false,
    disabled = false,
    showListName = false,
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

  const addedAt = (recommendationInfo as IListRecommendationInfo).addedAt

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

  const showCtaContainer = sponsored
    ? false
    : [
        !!onAddToList,
        !!onRemoveFromList,
        !!onManageDeleteClick,
        !!onManageEditClick,
        source === RecommendationInfoSourceType.MANAGE,
      ].some(v => !!v)

  const renderNote = () => {
    if (sponsored) {
      return null
    }

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
          className={classNames({
            'cursor-pointer': sessionUser,
          })}
          onClick={() => {
            if (sessionUser) {
              setAddNote(true)
            }
          }}
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

  // const renderTypeIcon = () => {
  //   const className = 'w-4'
  //   if (recommendationInfo.type === RecommendationType.BLOG) {
  //     return <DocumentTextIcon className={className} />
  //   }
  //   if (recommendationInfo.type === RecommendationType.MUSIC) {
  //     return <MusicNoteIcon className={className} />
  //   }
  //   if (recommendationInfo.type === RecommendationType.VIDEO) {
  //     return <VideoCameraIcon className={className} />
  //   }
  //   if (recommendationInfo.type === RecommendationType.PRODUCT) {
  //     return <ShoppingBagIcon className={className} />
  //   }
  //   return null
  // }

  const renderImage = () => {
    return (
      <CoreImage
        url={recommendationInfo.imageUrl || RECOMMENDATION_FALLBACK_IMAGE_URL}
        alt={`${recommendationInfo.title} recommendation on ${appConfig.global.app.name}`}
        className={classNames('', {
          'blur-sm': recommendationInfo.isAdult,
        })}
        onError={e => {
          e.currentTarget.src = RECOMMENDATION_FALLBACK_IMAGE_URL
        }}
      />
    )
  }

  const renderOwnerName = () => {
    if (!recommendationOwner) {
      return null
    }

    return (
      <span>
        by{' '}
        <CoreLink
          url={source === RecommendationInfoSourceType.LIST ? getProfilePageUrl(recommendationOwner!.username) : null}
          className={classNames('text-typo-paragraphLight text-sm', {
            underline: source === RecommendationInfoSourceType.LIST,
            'cursor-auto': source !== RecommendationInfoSourceType.LIST,
          })}>
          {recommendationOwner!.name}
        </CoreLink>
      </span>
    )
  }

  const renderListName = () => {
    if (!list) {
      return null
    }

    return (
      <span>
        From{' '}
        <CoreLink
          url={getListPageUrl(list!.id)}
          className={classNames('text-typo-paragraphLight text-sm', {
            underline: source === RecommendationInfoSourceType.LIST,
          })}>
          {list!.name}
        </CoreLink>
      </span>
    )
  }

  const renderAddedDate = () => {
    return (
      <>
        &nbsp;•&nbsp;
        <Tooltip content={`Added: ${dayjs(addedAt).format('lll')}`}>
          <span>{capitalize(`${getRelativeTime(addedAt)}`)}</span>
        </Tooltip>
      </>
    )
  }

  const renderCreatedDate = () => {
    return (
      <>
        &nbsp;•&nbsp;
        <Tooltip content={`Created: ${dayjs(recommendationInfo.createdAt).format('lll')}`}>
          <span>{capitalize(`${getRelativeTime(recommendationInfo.createdAt)}`)}</span>
        </Tooltip>
      </>
    )
  }

  return (
    <>
      <div
        className={classNames('flex items-start py-3 relative ', {
          // 'bg-denim': sponsored, // needed?
        })}>
        <div className="relative shadow-listInfoImage w-20 h-20 min-h-20 min-w-20">
          {source === RecommendationInfoSourceType.LIST ? (
            <CoreLink url={recommendationInfo.url} isExternal onClick={onLinkClick}>
              {renderImage()}
            </CoreLink>
          ) : (
            renderImage()
          )}
          {recommendationInfo.isAdult && (
            <div className="flex items-center absolute justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-clementine text-white p-1 rounded">
              <ExclamationIcon className="w-4 mr-1 font-medium" /> <span className="text-xs">NSFW</span>
            </div>
          )}
        </div>
        <div className="ml-3 flex-grow">
          <div
            className={classNames({
              'block max-w-[87%]': source === RecommendationInfoSourceType.LIST && isDesktop,
            })}>
            {source === RecommendationInfoSourceType.ADD ? (
              <span className="font-bold">{recommendationInfo.title}</span>
            ) : (
              <CoreLink url={recommendationInfo.url} isExternal className="font-bold" onClick={onLinkClick}>
                {recommendationInfo.title}
              </CoreLink>
            )}
          </div>

          <div className="text-typo-paragraphLight text-sm flex items-center">
            {showListName ? renderListName() : renderOwnerName()}
            {/* {recommendationInfo.type !== RecommendationType.OTHER && (
              <>
                &nbsp;•&nbsp;
                <Tooltip content={RECOMMENDATION_TYPE_DESCRIPTION_MAP[recommendationInfo.type]}>
                  <span>{renderTypeIcon()}</span>
                </Tooltip>
              </>
            )} */}
            {addedAt && renderAddedDate()}
            {source === RecommendationInfoSourceType.ADD || source === RecommendationInfoSourceType.MANAGE
              ? renderCreatedDate()
              : null}
          </div>

          {sponsored && (
            <div className="mt-1">
              <FeaturedLabel />
            </div>
          )}

          <div className="text-sm mt-2">{renderNote()}</div>

          {showCtaContainer && (
            <div
              className={classNames('flex items-center justify-end mt-2', {
                'mt-0 absolute right-1 top-1': source === RecommendationInfoSourceType.LIST && isDesktop,
              })}>
              {onRemoveFromList ? (
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
              {onManageDeleteClick && (
                <Tooltip content="Delete">
                  <div
                    className="bg-gallery font-semibold text-sm cursor-pointer py-1 px-2 rounded ml-2"
                    onClick={onManageDeleteClick}>
                    <TrashIcon className="w-4 " />
                  </div>
                </Tooltip>
              )}
              {onManageEditClick && (
                <Tooltip content="Edit">
                  <div
                    className="bg-gallery font-semibold text-sm cursor-pointer py-1 px-2 rounded ml-2"
                    onClick={onManageEditClick}>
                    <PencilAltIcon className="w-4 " />
                  </div>
                </Tooltip>
              )}

              {onAddToList ? (
                <CoreButton
                  label={'Add to list'}
                  icon={PlusIcon}
                  size={CoreButtonSize.SMALL}
                  type={CoreButtonType.SOLID_PRIMARY}
                  onClick={onAddToList}
                  disabled={disabled}
                  loading={loading}
                  className="ml-2"
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
