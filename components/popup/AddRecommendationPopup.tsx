import React, { useContext, useEffect, useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import { ArrowLeftIcon, CogIcon, PlusIcon } from '@heroicons/react/outline'
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
import { listSavedRecommendationsByEmail } from '../../firebase/store/saved-recommendations'
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

  const [savedRecommendations, setSavedRecommendations] = useState<IRecommendationInfo[]>([])
  const [listRecommendations, setListRecommendations] = useState<IListRecommendationInfo[]>(list.recommendations)

  const fetchRecommendations = async () => {
    toggleLoading(true)
    const recommendations = await listSavedRecommendationsByEmail(user!.email)
    setSavedRecommendations(recommendations)
    toggleLoading(false)
  }

  useEffect(() => {
    if (user) {
      fetchRecommendations()
    }
  }, [user])

  const handleOnSuccess = () => {
    if (onSuccess) {
      onSuccess()
    }
  }

  const handleAddToList = (recommendation: IRecommendationInfo) => {
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
        await revalidateUrls([getListPageUrl(list.id), getProfilePageUrl(list.owner.username)])
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
        toastError('Failed to add to the list')
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
          {/* <div className="font-medium font-primary-medium">Choose from the saved list</div> */}
          <CoreLink
            url={getSavedRecommendationsPageUrl()}
            onClick={onClose}
            className="bg-gallery font-medium text-sm cursor-pointer py-1 px-2 rounded font-primary-medium">
            <div className="flex">
              <CogIcon className="w-4 mr-1" />
              Manage
            </div>
          </CoreLink>
          <div
            className="bg-gallery font-medium text-sm cursor-pointer py-1 px-2 rounded font-primary-medium ml-2"
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
              message="No saved recommendations found."
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
            savedRecommendations.map(recommendationInfo => (
              <RecommendationInfo
                key={recommendationInfo.id}
                layout={RecommendationInfoLayoutType.INLINE}
                source={RecommendationInfoSourceType.ADD}
                recommendationInfo={recommendationInfo}
                recommendationOwner={user!}
                showAddToList={true}
                onAddToList={() => handleAddToList(recommendationInfo)}
              />
            ))
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
          onSuccess={() => {
            setPanel('saved')
            fetchRecommendations()
          }}
        />
      </div>
    )
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: onClose,
        title: (
          <div className="flex items-center">
            {panel === 'add' && <ArrowLeftIcon className="w-5 mr-3 cursor-pointer" onClick={() => setPanel('saved')} />}
            {panel === 'saved' ? 'Select from your saved list' : 'Add a new recommendation'}
          </div>
        ),
        disableOutsideClick: true,
        showCrossIcon: panel === 'saved',
      }}>
      <div className="addRecommendation">
        {renderSavedRecommendations()}
        {renderAddRecommendation()}
      </div>
    </FullWidthModal>
  )
}

export default AddRecommendationPopup
