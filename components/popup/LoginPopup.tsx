import React, { useContext } from 'react'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import Modal from '../modal/Modal'
import { prepareImageUrl } from '../../utils/image'
import { signInWithGoogle } from '../../firebase/auth/auth'
import { toastError, toastSuccess } from '../Toaster'
import { addUser } from '../../firebase/store/users'
import { prepareUserInfo, setLocalUserInfo } from '../../utils/user'
import ApplicationContext from '../ApplicationContext'
import { vibrate } from '../../utils/common'

interface ILoginPopupProps {
  onClose: () => void
}

const LoginPopup: React.FC<ILoginPopupProps> = props => {
  const { onClose } = props

  const applicationContext = useContext(ApplicationContext)
  const { methods } = applicationContext

  const handleGoogleLogin = () => {
    const processCommands = async () => {
      try {
        const user = await signInWithGoogle()
        const userInfo = await prepareUserInfo(user)
        await addUser(userInfo)
        vibrate()
        methods.updateUser(userInfo)
        setLocalUserInfo(userInfo)
        onClose()
        toastSuccess('Login successful!')
      } catch (e) {
        toastError('Failed to login!')
      }
    }

    processCommands()
  }

  return (
    <Modal dismissModal={() => onClose()} className="loginPopupOverrides">
      <div className="flex flex-col items-center px-4 pb-10">
        {/* TODO: Logo here */}
        <CoreImage
          url={prepareImageUrl('/images/ribbon.png', ImageSourceType.ASSET)}
          alt="Login promt"
          className="w-32 min-h-32 mb-4"
          disableLazyload
        />
        <div className="text-primaryText text-base mb-6 text-center">
          <span>Please login to sync your data across devices...</span>
        </div>
        <div className="">
          <CoreButton
            size={CoreButtonSize.LARGE}
            type={CoreButtonType.SOLID_PRIMARY}
            onClick={handleGoogleLogin}
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
