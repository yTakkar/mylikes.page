import React, { useContext, useEffect, useState } from 'react'
import { IRecommendationInfo } from '../../interface/recommendation'
import QuotesWrapper from '../QuotesWrapper'
import CoreLink from '../core/CoreLink'
import {
  DocumentTextIcon,
  GlobeAltIcon,
  PencilAltIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
  XIcon,
} from '@heroicons/react/outline'
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
import FeaturedLabel from '../FeaturedLabel'
import { getRelativeTime } from '../../utils/date'
import dayjs from 'dayjs'
import { capitalize } from '../../utils/common'
import { AnnotationIcon } from '@heroicons/react/solid'
import URLParse from 'url-parse'
import CoreImage from '../core/CoreImage'
import { RECOMMENDATION_FALLBACK_IMAGE_URL } from '../../constants/constants'
import appConfig from '../../config/appConfig'
import RecommendationTypeIcon from './RecommendationTypeIcon'
import { getLinkAd, shouldOpenRecommendationLinkAd } from '../../utils/ads'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
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
  openLinkAd?: boolean
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
    openLinkAd = false,
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

  const parsedUrl = URLParse(recommendationInfo.url, false)

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

  const openUrl = () => {
    const _linkAd = !openLinkAd ? false : shouldOpenRecommendationLinkAd()

    // if (linkAd) {
    //   window.open(getLinkAd(), '_blank', 'noopener')
    //   appAnalytics.sendEvent({
    //     action: AnalyticsEventType.AD_RECOMMENDATION_TEXT_LINK_VISIT,
    //     extra: {
    //       listId: list?.id,
    //       recommendationId: recommendationInfo.id,
    //       url: recommendationInfo.url,
    //       title: recommendationInfo.title,
    //       type: recommendationInfo.type,
    //     },
    //   })
    // } else {
    window.open(recommendationInfo.url, '_blank', 'noopener')
    // }
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
            className="text-typo-paragraphLight inline-flex items-center border-b cursor-pointer text-sm"
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
    return <RecommendationTypeIcon recommendation={recommendationInfo} source="recommendation" />
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _renderImage = () => {
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

    const sameUser = isSessionUser(user, recommendationOwner)

    return (
      <>
        <UserCircleIcon className="min-w-[14px] w-[14px] mr-[2px] inline relative top-[-1px]" />
        <CoreLink
          url={source === RecommendationInfoSourceType.LIST ? getProfilePageUrl(recommendationOwner!.username) : null}
          className={classNames('text-typo-paragraphLight text-sm inline', {
            underline: source === RecommendationInfoSourceType.LIST,
            'cursor-auto': source !== RecommendationInfoSourceType.LIST,
          })}>
          {recommendationOwner!.name}
          {sameUser ? ' (You)' : null}
        </CoreLink>
      </>
    )
  }

  const renderListName = () => {
    if (!list) {
      return null
    }

    return (
      <>
        <DocumentTextIcon className="min-w-[14px] w-[14px] mr-[2px] inline relative top-[-1px]" />
        <CoreLink
          url={getListPageUrl(list!.id)}
          className={classNames('text-typo-paragraphLight text-sm inline', {
            underline: source === RecommendationInfoSourceType.LIST,
          })}>
          {list!.name}
        </CoreLink>
      </>
    )
  }

  const renderDomain = () => {
    return (
      <>
        &nbsp;•&nbsp;
        <GlobeAltIcon className="min-w-[14px] w-[14px] mr-[2px] inline relative top-[-1px]" />
        <span className="inline break-all">{`${parsedUrl.hostname}`.replace('www.', '')}</span>
      </>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _renderAddedDate = () => {
    return (
      <>
        &nbsp;•&nbsp;
        <Tooltip content={`Added: ${dayjs(addedAt).format('lll')}`}>
          <span>{capitalize(`${getRelativeTime(addedAt)}`)}</span>
        </Tooltip>
      </>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _renderCreatedDate = () => {
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
        className={classNames('flex py-3 relative ', {
          // 'bg-denim': sponsored, // needed?
        })}>
        <div className="relative w-10 h-10 min-w-10 min-h-10 top-1">
          {source === RecommendationInfoSourceType.LIST ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                openUrl()
                onLinkClick?.()
              }}>
              {renderTypeIcon()}
            </div>
          ) : (
            renderTypeIcon()
          )}
          {recommendationInfo.isAdult && (
            <div className="flex items-center relative justify-center bg-clementine text-white rounded p-[2px] px-1 mt-1 font-semibold text-xxs">
              <span>NSFW</span>
            </div>
          )}
        </div>
        <div className="ml-3 flex-grow">
          <div
            className={classNames('text-base md:text-lg md:leading-6', {
              'block max-w-[87%]': source === RecommendationInfoSourceType.LIST && isDesktop,
            })}>
            {source === RecommendationInfoSourceType.ADD ? (
              <span className="font-bold">{recommendationInfo.title}</span>
            ) : (
              <div
                className="font-bold cursor-pointer"
                onClick={() => {
                  openUrl()
                  onLinkClick?.()
                }}>
                {recommendationInfo.title}
              </div>
            )}
          </div>

          <div className="text-typo-paragraphLight text-sm inline">
            {showListName ? renderListName() : renderOwnerName()}
            {/* {addedAt && renderAddedDate()}
            {source === RecommendationInfoSourceType.ADD || source === RecommendationInfoSourceType.MANAGE
              ? renderCreatedDate()
              : null} */}
            {renderDomain()}
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
                <Tooltip content="Remove from list" disableOnMobile>
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
                <Tooltip content="Delete" disableOnMobile>
                  <span>
                    <button
                      className="bg-gallery font-semibold text-sm cursor-pointer py-1 px-2 rounded ml-2"
                      onClick={onManageDeleteClick}>
                      <TrashIcon className="w-4 " />
                    </button>
                  </span>
                </Tooltip>
              )}
              {onManageEditClick && (
                <Tooltip content="Edit" disableOnMobile>
                  <span>
                    <button
                      className="bg-gallery font-semibold text-sm cursor-pointer py-1 px-2 rounded ml-2"
                      onClick={onManageEditClick}>
                      <PencilAltIcon className="w-4 " />
                    </button>
                  </span>
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
