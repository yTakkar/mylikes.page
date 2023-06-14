import React, { useState } from 'react'
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

interface ICreateListPopupProps {
  onClose: () => void
}

const CreateListPopup: React.FC<ICreateListPopupProps> = props => {
  const { onClose } = props

  const [panel, setPanel] = useState<'saved' | 'add'>('saved')

  // const recommendations = Array.from({ length: 10 })
  const recommendations = []

  const renderSavedRecommendations = () => {
    return (
      <div className="saved">
        <div className="flex justify-between items-center">
          <div className="font-medium font-primary-medium">Choose from the saved list</div>
          {recommendations.length > 0 && (
            <div
              className="bg-gallery font-medium text-sm cursor-pointer py-1 px-2 rounded font-primary-medium"
              onClick={() => setPanel('add')}>
              <div className="flex">
                <CogIcon className="w-4 mr-1" />
                Manage
              </div>
            </div>
          )}
        </div>

        <CoreDivider className="my-5" />

        <div className="mt-4">
          {recommendations.length === 0 ? (
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
            recommendations.map((_, index) => (
              <RecommendationInfo
                key={index}
                layout={RecommendationInfoLayoutType.INLINE}
                source={RecommendationInfoSourceType.ADD}
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
        <AddRecommendationForm />
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
            {panel === 'saved' ? 'Add recommendations to the list' : 'Add a new recommendation'}
          </div>
        ),
        disableOutsideClick: true,
      }}>
      <div className="addRecommendation">
        {renderSavedRecommendations()}
        {renderAddRecommendation()}
      </div>
    </FullWidthModal>
  )
}

export default CreateListPopup
