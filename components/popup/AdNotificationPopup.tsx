import React from 'react'
import Modal from '../modal/Modal'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import { prepareImageUrl } from '../../utils/image'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'

interface IAdNotificationProps {
  onClose: () => void
  onSeen?: () => void
}

const AdNotificationPopup: React.FC<IAdNotificationProps> = props => {
  const { onClose, onSeen } = props

  return (
    <Modal dismissModal={() => onClose()} showCrossIcon={false} showHeader={false}>
      <div className="lg:flex items-center px-2 pt-6 pb-4 lg:px-4">
        <div className="flex justify-center lg:block">
          <CoreImage
            url={prepareImageUrl(`/images/manja.gif`, ImageSourceType.ASSET)}
            alt="Please support us"
            className="mb-4 lg:mb-0 w-44 min-w-44"
            useTransparentPlaceholder
          />
        </div>
        <div className="ml-4">
          <div>
            <p className="text-xl font-bold mb-2">Please support us 🙏</p>

            <p className="mb-4">
              To keep MyLikes free and accessible for everyone,{' '}
              <b>we&apos;re introducing ads. They&apos;ll show sometimes when you open recommendations</b>. These ads
              help us pay for the servers and keep the lights on.
            </p>

            <p>
              Your experience remains our priority, and we&apos;re committed to ensuring these ads are unintrusive.
              Thank you 🌐✨
            </p>
          </div>
        </div>
      </div>

      <div className={'px-4 lg:px-6 pb-3 flex justify-end'}>
        <CoreButton
          type={CoreButtonType.SOLID_PRIMARY}
          label="Got it"
          size={CoreButtonSize.MEDIUM}
          onClick={() => {
            onSeen?.()
            onClose()
          }}
        />
      </div>
    </Modal>
  )
}

export default AdNotificationPopup
