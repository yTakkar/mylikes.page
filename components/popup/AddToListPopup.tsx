import React, { useContext, useEffect, useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import NoContent from '../NoContent'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import ApplicationContext from '../ApplicationContext'
import Loader, { LoaderType } from '../loader/Loader'
import { IListDetail, IListRecommendationInfo } from '../../interface/list'
import { listListsByUser, updateList } from '../../firebase/store/list'
import { getListPageUrl, getProfilePageUrl } from '../../utils/routes'
import { toastError, toastSuccess } from '../Toaster'
import { revalidateUrls } from '../../utils/revalidate'
import { trackAddToList } from '../../firebase/store/addToListTracking'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { pluralize } from '../../utils/common'

interface IAddToListPopupProps {
  listDetail: IListDetail
  listRecommendation: IListRecommendationInfo
  onClose: () => void
}

declare const window: any

const AddToListPopup: React.FC<IAddToListPopupProps> = props => {
  const { listDetail, listRecommendation, onClose } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  const [loading, toggleLoading] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [operationLoading, toggleOperationLoading] = useState(false)
  const [lists, setLists] = useState<IListDetail[]>([])

  const fetchLists = async () => {
    try {
      toggleLoading(true)
      const fetchedLists = await listListsByUser(user!)
      window.USER_LISTS = fetchedLists
      setLists(fetchedLists)
      toggleLoading(false)
    } catch (e) {
      toastError('Something went wrong!')
      appAnalytics.captureException(e)
    }
  }

  useEffect(() => {
    if (user) {
      if (window.USER_LISTS) {
        setLists(window.USER_LISTS)
      } else {
        fetchLists()
      }
    }
  }, [user])

  const handleAddToList = (list: IListDetail) => {
    setSelectedListId(list.id)
    toggleOperationLoading(true)

    const processCommands = async () => {
      const addedAt = new Date().getTime()
      const updatedListRecommendation: IListRecommendationInfo = {
        ...listRecommendation,
        addedAt: addedAt,
        notes: '',
      }
      const updatedList = [updatedListRecommendation, ...list.recommendations]

      try {
        await updateList(list.id, {
          recommendations: updatedList,
        })
        // invalidate profile page cache?
        await revalidateUrls([
          getListPageUrl(list.id),
          // getProfilePageUrl(list.owner!.username)
        ])
        await fetchLists()
        trackAddToList({
          listId: listDetail.id,
          listRecommendationId: listRecommendation.id,
          targetListId: list.id,
          targetListName: list.name,
          addedAt: addedAt,
        })
        appAnalytics.sendEvent({
          action: AnalyticsEventType.RECOMMENDATION_ADD_TO_LIST,
          extra: {
            listId: listDetail.id,
            recommendationId: listRecommendation.id,
            targetListId: list.id,
          },
        })
        toastSuccess('Added to the selected list')
      } catch (e) {
        appAnalytics.captureException(e)
        toastError('Failed to add')
      } finally {
        toggleOperationLoading(false)
      }
    }

    processCommands()
  }

  const renderList = (list: IListDetail) => {
    return (
      <div key={list.id}>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="font-semibold">{list.name}</div>
            <div className="text-sm text-gray-600">{pluralize('recommendation', list.recommendations.length)}</div>
          </div>
          <div className="ml-4">
            <CoreButton
              size={CoreButtonSize.MEDIUM}
              type={CoreButtonType.SOLID_PRIMARY}
              label="Add"
              onClick={() => handleAddToList(list)}
              disabled={operationLoading}
              loading={selectedListId === list.id && operationLoading}
            />
          </div>
        </div>
        <div className="border-b border-gray-200 my-2" />
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <Loader type={LoaderType.ELLIPSIS} />
    }

    return (
      <div className="mt-4 px-3">
        {lists.length === 0 ? (
          <NoContent
            message="You don't have any list yet."
            actions={[
              {
                label: 'Create a list',
                size: CoreButtonSize.MEDIUM,
                type: CoreButtonType.SOLID_PRIMARY,
                url: getProfilePageUrl(user!.username),
              },
            ]}
          />
        ) : (
          <div>
            {lists.map(list => (
              <React.Fragment key={list.id}>{renderList(list)}</React.Fragment>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: onClose,
        title: 'Add to your lists',
        disableOutsideClick: true,
      }}>
      <div>{renderContent()}</div>
    </FullWidthModal>
  )
}

export default AddToListPopup
