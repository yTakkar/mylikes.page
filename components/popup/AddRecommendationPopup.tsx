import React, { useContext, useEffect, useRef, useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import { ArrowLeftIcon, CogIcon, ExternalLinkIcon, InformationCircleIcon, PlusIcon } from '@heroicons/react/outline'
import RecommendationInfo, {
  RecommendationInfoLayoutType,
  RecommendationInfoSourceType,
} from '../recommendation/RecommendationInfo'
import CoreDivider from '../core/CoreDivider'
import classNames from 'classnames'
import AddRecommendationForm from '../recommendation/AddRecommendationForm'
import NoContent from '../NoContent'
import { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { IRecommendationInfo } from '../../interface/recommendation'
import {
  deleteSavedRecommendationById,
  listSavedRecommendationsByEmail,
} from '../../firebase/store/saved-recommendations'
import ApplicationContext from '../ApplicationContext'
import Loader, { LoaderType } from '../loader/Loader'
import { IListDetail, IListRecommendationInfo } from '../../interface/list'
import { updateList } from '../../firebase/store/list'
import { toastError, toastSuccess } from '../Toaster'
import CoreLink from '../core/CoreLink'
import { getListPageUrl, getProfilePageUrl, getSavedRecommendationsPageUrl } from '../../utils/routes'
import { revalidateUrls } from '../../utils/revalidate'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import Tooltip from '../Tooltip'
import Alert from '../modal/Alert'

interface IAddRecommendationPopupProps {
  list: IListDetail
  onClose: () => void
  onSuccess?: () => void
}

const AddRecommendationPopup: React.FC<IAddRecommendationPopupProps> = props => {
  const { list, onClose, onSuccess } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  const [loading, toggleLoading] = useState(false)
  const [panel, setPanel] = useState<'saved' | 'add'>('saved')
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string | null>(null)
  const [operationLoading, toggleOperationLoading] = useState(false)

  const [recommendationToDelete, setRecommendationToDelete] = useState<IRecommendationInfo | null>(null)
  const [deleteLoading, toggleDeleteLoading] = useState(false)

  const [recommendationToEdit, setRecommendationToEdit] = useState<IRecommendationInfo | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const [savedRecommendations, setSavedRecommendations] = useState<IRecommendationInfo[]>([])
  const [listRecommendations, setListRecommendations] = useState<IListRecommendationInfo[]>(list.recommendations)

  const fetchRecommendations = async () => {
    try {
      if (!savedRecommendations?.length) {
        toggleLoading(true)
      }

      const recommendations = await listSavedRecommendationsByEmail(user!.email)
      const sortedRecommendations = recommendations.sort((a, b) => {
        return b.createdAt - a.createdAt
      })
      setSavedRecommendations(sortedRecommendations)
      toggleLoading(false)
    } catch (e) {
      console.log(e)
      appAnalytics.captureException(e)
      toastError('Something went wrong!')
    }
  }

  useEffect(() => {
    if (user) {
      fetchRecommendations()
    }
  }, [user])

  useEffect(() => {
    if (containerRef.current) {
      if (panel === 'saved') {
        containerRef.current.querySelector('.saved')?.classList.remove('force-hide')
        containerRef.current.querySelector('.add')?.classList.add('force-hide')
        containerRef.current?.scrollTo(0, 0)
      }
      if (panel === 'add') {
        containerRef.current.querySelector('.saved')?.classList.add('force-hide')
        containerRef.current.querySelector('.add')?.classList.remove('force-hide')
      }
    }
  }, [panel])

  const handleOnSuccess = () => {
    if (onSuccess) {
      onSuccess()
    }
  }

  const handleDelete = async () => {
    if (deleteLoading) {
      return
    }

    toggleDeleteLoading(true)
    try {
      await deleteSavedRecommendationById(recommendationToDelete!.id)
      fetchRecommendations()
      toastSuccess('Recommendation deleted!')
      setRecommendationToDelete(null)
      appAnalytics.sendEvent({
        action: AnalyticsEventType.SAVED_RECOMMENDATION_REMOVE,
        extra: {
          id: recommendationToDelete!.id,
          title: recommendationToDelete!.title,
          url: recommendationToDelete!.url,
          type: recommendationToDelete!.type,
          ownerEmail: user!.email,
        },
      })
    } catch (e) {
      appAnalytics.captureException(e)
      console.error('list:delete:error', e)
      toastError('Failed to delete recommendation!')
    }
    toggleDeleteLoading(false)
  }

  const handleAddToList = (recommendation: IRecommendationInfo) => {
    setSelectedRecommendationId(recommendation.id)
    toggleOperationLoading(true)

    const processCommands = async () => {
      const listRecommendation: IListRecommendationInfo = {
        ...recommendation,
        addedAt: new Date().getTime(),
      }
      const updatedList = [listRecommendation, ...listRecommendations]

      try {
        await updateList(list.id, {
          recommendations: updatedList,
        })
        await revalidateUrls([getListPageUrl(list.id), getProfilePageUrl(list.owner!.username)])
        setListRecommendations(updatedList)
        toastSuccess('Added to the list')
        appAnalytics.sendEvent({
          action: AnalyticsEventType.RECOMMENDATION_ADD,
          extra: {
            listId: list.id,
            recommendationId: recommendation.id,
            url: recommendation.url,
            title: recommendation.title,
            type: recommendation.type,
          },
        })
        handleOnSuccess()
      } catch (e) {
        appAnalytics.captureException(e)
        toastError('Failed to add to the list')
      } finally {
        toggleOperationLoading(false)
      }
    }

    processCommands()
  }

  const renderSavedRecommendations = () => {
    if (loading) {
      return <Loader type={LoaderType.ELLIPSIS} />
    }

    return (
      <div className="saved">
        <div className="flex items-center">
          {/* <div className="font-semibold">Choose from the saved list</div> */}
          <CoreLink
            url={getSavedRecommendationsPageUrl()}
            onClick={onClose}
            className="bg-gallery font-semibold text-sm cursor-pointer py-1 px-2 rounded">
            <Tooltip content="Manage saved recommendations">
              <div className="flex">
                <CogIcon className="w-4 mr-1" />
                Manage
                <ExternalLinkIcon className="w-4 ml-1" />
              </div>
            </Tooltip>
          </CoreLink>
          <div
            className="bg-gallery font-semibold text-sm cursor-pointer py-1 px-2 rounded ml-2"
            onClick={() => setPanel('add')}>
            <div className="flex">
              <PlusIcon className="w-4 mr-1" />
              Add new
            </div>
          </div>
        </div>

        <CoreDivider className="my-5" />

        <div className="mt-4">
          {savedRecommendations.length === 0 ? (
            <NoContent
              message={
                <div className="inline-flex items-center">
                  <span>No saved recommendations found.</span>
                  <Tooltip
                    content={`We allow you to select recommendations from the saved list. This helps you to save a recommendation only once and use it across quickly with a single click.`}>
                    <span>
                      <InformationCircleIcon className="w-5 ml-1" />
                    </span>
                  </Tooltip>
                </div>
              }
              actions={[
                {
                  label: 'Add new',
                  size: CoreButtonSize.MEDIUM,
                  type: CoreButtonType.SOLID_PRIMARY,
                  onClick: () => setPanel('add'),
                },
              ]}
            />
          ) : (
            savedRecommendations.map((recommendationInfo, index) => {
              const isLast = index === savedRecommendations.length - 1
              return (
                <div key={recommendationInfo.id}>
                  <RecommendationInfo
                    layout={RecommendationInfoLayoutType.INLINE}
                    source={RecommendationInfoSourceType.ADD}
                    recommendationInfo={recommendationInfo}
                    recommendationOwner={user!}
                    onAddToList={() => handleAddToList(recommendationInfo)}
                    loading={selectedRecommendationId === recommendationInfo.id && operationLoading}
                    disabled={operationLoading}
                    onManageDeleteClick={() => setRecommendationToDelete(recommendationInfo)}
                    onManageEditClick={() => {
                      setRecommendationToEdit(recommendationInfo)
                      setPanel('add')
                    }}
                  />
                  {!isLast && <div className="w-full h-[1px] bg-gallery" />}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  const renderAddRecommendation = () => {
    return (
      <div
        className={classNames('add', {
          shown: panel === 'add',
        })}>
        <AddRecommendationForm
          recommendation={recommendationToEdit || undefined}
          onSuccess={() => {
            setPanel('saved')
            fetchRecommendations()
          }}
        />
      </div>
    )
  }

  return (
    <>
      <FullWidthModal
        modal={{
          dismissModal: onClose,
          title: (
            <div className="flex items-center">
              {panel === 'add' && (
                <ArrowLeftIcon className="w-5 mr-3 cursor-pointer" onClick={() => setPanel('saved')} />
              )}
              {panel === 'saved'
                ? 'Select from saved recommendations'
                : recommendationToEdit
                ? 'Edit saved recommendation'
                : 'Add a new recommendation'}
              {savedRecommendations.length > 0 && (
                <Tooltip content="We allow you to select recommendations from the saved list. This helps you to save a recommendation only once and use it across quickly with a single click.">
                  <span>
                    <InformationCircleIcon className="w-5 ml-1" />
                  </span>
                </Tooltip>
              )}
            </div>
          ),
          disableOutsideClick: true,
          showCrossIcon: panel === 'saved',
        }}>
        <div className="addRecommendation" ref={containerRef}>
          {renderSavedRecommendations()}
          {renderAddRecommendation()}
        </div>
      </FullWidthModal>

      {recommendationToDelete ? (
        <Alert
          dismissModal={() => setRecommendationToDelete(null)}
          title="Delete Confirmation"
          subTitle="Are you sure you want to do this? You cannot undo this."
          cta={{
            primary: {
              show: true,
              label: 'Delete',
              loading: deleteLoading,
              onClick: handleDelete,
            },
            secondary: {
              show: true,
              label: 'Cancel',
              onClick: () => setRecommendationToDelete(null),
            },
          }}
        />
      ) : null}
    </>
  )
}

export default AddRecommendationPopup
