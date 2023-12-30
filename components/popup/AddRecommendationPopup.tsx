import React, { useContext, useEffect, useRef, useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  InformationCircleIcon,
  SearchIcon,
} from '@heroicons/react/outline'
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
import { getListPageUrl } from '../../utils/routes'
import { revalidateUrls } from '../../utils/revalidate'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import Tooltip from '../Tooltip'
import Alert from '../modal/Alert'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import { dynamicFuseJs } from '../dynamicModules'

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
  const [panel, setPanel] = useState<'saved' | 'add'>('add')
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string | null>(null)
  const [operationLoading, toggleOperationLoading] = useState(false)

  const [recommendationToDelete, setRecommendationToDelete] = useState<IRecommendationInfo | null>(null)
  const [deleteLoading, toggleDeleteLoading] = useState(false)

  const [recommendationToEdit, setRecommendationToEdit] = useState<IRecommendationInfo | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const [listRecommendations, setListRecommendations] = useState<IListRecommendationInfo[]>(list.recommendations)

  const [initialSavedRecommendations, setInitialSavedRecommendations] = useState<IRecommendationInfo[]>([])
  const [savedRecommendations, setSavedRecommendations] = useState<IRecommendationInfo[]>([])

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setSavedRecommendations(initialSavedRecommendations)
  }, [initialSavedRecommendations])

  const handleSearch = () => {
    dynamicFuseJs().then(mod => {
      const result = new mod.default(initialSavedRecommendations, {
        keys: ['title', 'url'],
        includeScore: true,
        minMatchCharLength: 1,
      }).search(searchTerm)
      const results = result.filter(resultItem => resultItem.score! <= 0.5).map(resultItem => resultItem.item)
      setSavedRecommendations(results)
    })
  }

  useEffect(() => {
    if (searchTerm) {
      handleSearch()
    } else {
      setSavedRecommendations(initialSavedRecommendations)
    }
  }, [searchTerm, initialSavedRecommendations])

  useEffect(() => {
    if (panel === 'saved') {
      setRecommendationToEdit(null)
    }
  }, [panel])

  const fetchRecommendations = async () => {
    try {
      if (!initialSavedRecommendations?.length) {
        toggleLoading(true)
      }

      const recommendations = await listSavedRecommendationsByEmail(user!.email)
      const sortedRecommendations = recommendations.sort((a, b) => {
        return b.createdAt - a.createdAt
      })
      setInitialSavedRecommendations(sortedRecommendations)
      toggleLoading(false)
    } catch (e) {
      console.log(e)
      appAnalytics.captureException(e)
      toastError('Something went wrong!')
    }
  }

  useEffect(() => {
    if (user && panel === 'saved') {
      fetchRecommendations()
    }
  }, [user, panel])

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
        // invalidate profile page cache?
        await revalidateUrls([
          getListPageUrl(list.id),
          // getProfilePageUrl(list.owner!.username)
        ])
        toastSuccess('Added to the list')
        appAnalytics.sendEvent({
          action: AnalyticsEventType.RECOMMENDATION_ADD_FROM_LIST,
          extra: {
            listId: list.id,
            recommendationId: recommendation.id,
            url: recommendation.url,
            title: recommendation.title,
            type: recommendation.type,
          },
        })
        setListRecommendations(updatedList)
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

  const renderActions = () => {
    return (
      <div className="flex items-center">
        <div className="flex-grow relative">
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Search by title or URL"
            value={searchTerm}
            setValue={setSearchTerm}
            autoComplete="off"
            inputClassName={'!py-1 !pr-8 !pl-2'}
          />
          <SearchIcon className="w-5 absolute top-1/2 transform -translate-y-1/2 right-2 text-gray-500" />
        </div>
      </div>
    )
  }

  const renderSavedRecommendations = () => {
    if (loading) {
      return <Loader type={LoaderType.ELLIPSIS} />
    }

    return (
      <div className="saved">
        {renderActions()}

        <CoreDivider className="my-5" />

        <div className="mt-4">
          {initialSavedRecommendations.length === 0 ? (
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

  const showSelectMessage = panel === 'add' && !recommendationToEdit

  const renderAddRecommendation = () => {
    return (
      <>
        <div
          className={classNames('add', {
            shown: panel === 'add',
            showSelectMessage,
          })}>
          <AddRecommendationForm
            key={recommendationToEdit?.id}
            list={list}
            recommendation={recommendationToEdit || undefined}
            onSuccess={() => {
              if (recommendationToEdit) {
                setPanel('saved')
                fetchRecommendations()
              } else {
                handleOnSuccess()
                onClose()
              }
            }}
          />
        </div>
      </>
    )
  }

  const getTitle = () => {
    if (panel === 'saved') {
      return `Select from saved recommendations ${
        initialSavedRecommendations.length > 0 ? `(${initialSavedRecommendations.length})` : ''
      }`
    }
    if (panel === 'add') {
      return recommendationToEdit ? 'Edit saved recommendation' : 'Add a new recommendation'
    }
    return null
  }

  return (
    <>
      <FullWidthModal
        modal={{
          dismissModal: onClose,
          title: (
            <div className="flex items-center">
              {panel === 'saved' || recommendationToEdit ? (
                <ArrowLeftIcon
                  className="w-5 mr-3 cursor-pointer"
                  onClick={() => {
                    if (recommendationToEdit) {
                      setPanel('saved')
                      // setRecommendationToEdit(null)
                    } else {
                      setPanel('add')
                    }
                  }}
                />
              ) : null}
              {getTitle()}
            </div>
          ),
          disableOutsideClick: true,
          showCrossIcon: true,
        }}>
        {showSelectMessage ? (
          <div
            className="text-sm flex items-center bg-gallery p-2 absolute w-full z-10 cursor-pointer"
            onClick={() => setPanel('saved')}>
            <ClipboardListIcon className="inline-block w-4 h-4 mr-1" />
            Select from your saved recommendations list
            <ChevronRightIcon className="inline-block w-4 h-4 ml-1" />
          </div>
        ) : null}
        <div className="addRecommendation" ref={containerRef}>
          {renderAddRecommendation()}
          {renderSavedRecommendations()}
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
