import React from 'react'
import Modal from '../modal/Modal'

interface IAdNotificationProps {
  onClose: () => void
}

const AdNotificationPopup: React.FC<IAdNotificationProps> = props => {
  const { onClose } = props

  return (
    <Modal dismissModal={() => onClose()}>
      <div>Hello</div>
    </Modal>
  )
}

export default AdNotificationPopup
