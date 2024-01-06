import React, { useContext } from 'react'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import Modal from '../modal/Modal'
import { prepareImageUrl } from '../../utils/image'
import ApplicationContext from '../ApplicationContext'

interface ILoginPopupProps {
  onClose: () => void
}

const LoginPopup: React.FC<ILoginPopupProps> = props => {
  const { onClose } = props

  const applicationContext = useContext(ApplicationContext)
  const { methods } = applicationContext

  return (
    <Modal dismissModal={() => onClose()} className="loginPopupOverrides">
      <div className="flex flex-col items-center px-4 pb-10">
        <CoreImage
          url={prepareImageUrl('/images/intensify-honor.gif', ImageSourceType.ASSET)}
          alt="Login promt"
          className="w-44 mb-4"
          disableLazyload
        />
        <div className="text-primaryText text-base mb-6 text-center">
          <span>Please login to sync your data across devices...</span>
        </div>
        <div className="">
          <CoreButton
            size={CoreButtonSize.LARGE}
            type={CoreButtonType.SOLID_PRIMARY}
            onClick={() => methods.login().then(() => onClose())}
            label={
              <>
                <CoreImage
                  url={prepareImageUrl('/images/icons/third-party-login/google.svg', ImageSourceType.ASSET)}
                  alt=""
                  className="w-6 mr-2"
                />{' '}
                Continue with Google
              </>
            }
          />
        </div>
      </div>
    </Modal>
  )
}

export default LoginPopup
