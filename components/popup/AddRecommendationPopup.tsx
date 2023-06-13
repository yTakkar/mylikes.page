import React, { useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import { PlusIcon } from '@heroicons/react/outline'
import RecommendationInfo, { RecommendationInfoLayoutType } from '../recommendation/RecommendationInfo'
import CoreDivider from '../core/CoreDivider'
import classNames from 'classnames'

interface ICreateListPopupProps {
  onClose: () => void
}

const CreateListPopup: React.FC<ICreateListPopupProps> = props => {
  const { onClose } = props

  const [panel, setPanel] = useState<'saved' | 'add'>('saved')

  const renderSavedRecommendations = () => {
    return (
      <div className="saved">
        <div className="flex justify-between items-center">
          <div className="font-medium font-primary-medium">Choose from the saved list</div>
          <div
            className="bg-gallery font-medium text-sm cursor-pointer py-1 px-2 rounded font-primary-medium"
            onClick={() => setPanel('add')}>
            <div className="flex">
              <PlusIcon className="w-4 mr-1" />
              Add new
            </div>
          </div>
        </div>

        <CoreDivider className="my-5" />

        <div className="mt-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <RecommendationInfo key={index} layout={RecommendationInfoLayoutType.INLINE} />
          ))}
        </div>
      </div>
    )
  }

  const renderAddRecommendation = () => {
    return (
      <div
        className={classNames('add', {
          shown: panel === 'add',
        })}></div>
    )
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: onClose,
        title: 'Add a recommendation',
        disableOutsideClick: true,
      }}>
      <div className="add-recommendation">
        {renderSavedRecommendations()}
        {renderAddRecommendation()}
      </div>
    </FullWidthModal>
  )
}

export default CreateListPopup
