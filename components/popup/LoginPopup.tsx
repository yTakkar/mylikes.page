import React from 'react'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import Modal from '../modal/Modal'
import { prepareImageUrl } from '../../utils/image'

interface ILoginPopupProps {
  onClose: () => void
}

const LoginPopup: React.FC<ILoginPopupProps> = props => {
  const { onClose } = props

  return (
    <Modal dismissModal={() => onClose()} className="loginPopupOverrides">
      <div className="flex flex-col items-center px-4 pb-4">
        <CoreImage
          url={prepareImageUrl('/images/ribbon.png', ImageSourceType.ASSET)}
          alt="Login promt"
          className="w-32 min-h-32 mb-4"
          disableLazyload
        />
        <div className="text-primaryText text-base mb-6 text-center">
          <span>Please log in to access your account, orders and much more...</span>
        </div>
        <div className="">
          <CoreButton label={'Proceed to Login'} size={CoreButtonSize.LARGE} type={CoreButtonType.SOLID_PRIMARY} />
        </div>
      </div>
    </Modal>
  )
}

export default LoginPopup
