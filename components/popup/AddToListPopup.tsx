import React, { useContext, useEffect, useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import NoContent from '../NoContent'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import ApplicationContext from '../ApplicationContext'
import Loader, { LoaderType } from '../loader/Loader'
import { IListDetail, IListRecommendationInfo } from '../../interface/list'
import { listListsByUser, updateList } from '../../firebase/store/list'
import { getProfilePageUrl } from '../../utils/routes'
import { toastError, toastSuccess } from '../Toaster'

interface IAddToListPopupProps {
  listRecommendation: IListRecommendationInfo
  onClose: () => void
}

declare const window: any

const AddToListPopup: React.FC<IAddToListPopupProps> = props => {
  const { listRecommendation, onClose } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  const [loading, toggleLoading] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [operationLoading, toggleOperationLoading] = useState(false)
  const [lists, setLists] = useState<IListDetail[]>([])

  const fetchLists = async () => {
    toggleLoading(true)
    const fetchedLists = await listListsByUser(user!)
    window.USER_LISTS = fetchedLists
    setLists(fetchedLists)
    toggleLoading(false)
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

    const updatedListRecommendation: IListRecommendationInfo = {
      ...listRecommendation,
      addedAt: new Date().getTime(),
      notes: '',
    }
    const updatedList = [updatedListRecommendation, ...list.recommendations]

    updateList(list.id, {
      recommendations: updatedList,
    })
      .then(() => {
        toastSuccess('Added to the selected list')
      })
      .catch(() => {
        toastError('Failed to add')
      })
      .finally(() => {
        toggleOperationLoading(false)
      })
  }

  const renderList = (list: IListDetail) => {
    return (
      <div key={list.id}>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="font-semibold">{list.name}</div>
            <div className="text-sm text-gray-600">{list.recommendations.length} recommendations</div>
          </div>
          <div className="ml-4">
            <CoreButton
              size={CoreButtonSize.MEDIUM}
              type={CoreButtonType.SOLID_PRIMARY}
              label="Add"
              onClick={() => handleAddToList(list)}
              disabled={selectedListId === list.id && operationLoading}
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
                url: getProfilePageUrl(user!),
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
