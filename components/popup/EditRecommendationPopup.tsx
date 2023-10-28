import React from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import AddRecommendationForm from '../recommendation/AddRecommendationForm'
import { IRecommendationInfo } from '../../interface/recommendation'

interface IEditRecommendationPopupProps {
  recommendation?: IRecommendationInfo
  onClose: () => void
  onSuccess?: () => void
}

const EditRecommendationPopup: React.FC<IEditRecommendationPopupProps> = props => {
  const { recommendation, onClose, onSuccess } = props

  const handleOnSuccess = () => {
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: onClose,
        title: recommendation ? 'Edit recommendation' : 'Add recommendation',
        disableOutsideClick: true,
      }}>
      <div className="px-3 py-4">
        <AddRecommendationForm
          list={null}
          recommendation={recommendation}
          onSuccess={() => {
            onClose()
            handleOnSuccess()
          }}
        />
      </div>
    </FullWidthModal>
  )
}

export default EditRecommendationPopup
