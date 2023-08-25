import React, { useContext, useEffect, useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { getAvatarsList } from '../../utils/avatars'
import { toastError, toastSuccess } from '../Toaster'
import Loader, { LoaderType } from '../loader/Loader'
import CoreImage from '../core/CoreImage'
import classNames from 'classnames'
import ApplicationContext from '../ApplicationContext'
import { updateUser } from '../../firebase/store/users'
import { revalidateUrls } from '../../utils/revalidate'
import { getProfilePageUrl } from '../../utils/routes'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'

interface IChangeAvatarPopupProps {
  onClose: () => void
}

const ChangeAvatarPopup: React.FC<IChangeAvatarPopupProps> = props => {
  const { onClose } = props

  const applicationContext = useContext(ApplicationContext)
  const { user, methods } = applicationContext

  const [avatars, setAvatars] = useState<string[]>([])
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(user?.avatarUrl || null)
  const [loading, toggleLoading] = useState(false)

  const hasAvatarChanged = selectedAvatar !== user?.avatarUrl

  useEffect(() => {
    toggleLoading(true)

    getAvatarsList()
      .then(setAvatars)
      .catch(e => {
        toastError('Failed to load avatars')
        appAnalytics.captureException(e)
      })
      .finally(() => toggleLoading(false))
  }, [])

  const handleChange = () => {
    const processCommands = async () => {
      if (hasAvatarChanged && selectedAvatar) {
        const updatedUserInfo = {
          ...user!,
          avatarUrl: selectedAvatar,
        }
        await updateUser(user!.email, {
          avatarUrl: selectedAvatar,
        })
        await revalidateUrls([getProfilePageUrl(user!.username)])
        methods.updateUser(updatedUserInfo)
        toastSuccess('Profile picture changed!')
        appAnalytics.sendEvent({
          action: AnalyticsEventType.EDIT_PROFILE_AVATAR,
          extra: {
            avatar: selectedAvatar,
          },
        })
        onClose()
      }
    }

    processCommands()
  }

  const renderContent = () => {
    return (
      <div className="grid grid-cols-4 md:grid-cols-6 gap-5">
        {avatars.map(avatar => (
          <div
            key={avatar}
            onClick={() => {
              setSelectedAvatar(avatar)
            }}
            className="rounded-full">
            <CoreImage
              url={avatar}
              alt={``}
              className={classNames('rounded-full cursor-pointer transform transition-transform hover:scale-105', {
                'ring-4 ring-brand-primary': selectedAvatar === avatar,
              })}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: onClose,
        title: 'Change Profile Picture',
        disableOutsideClick: true,
      }}
      footer={{
        buttons: [
          {
            label: 'Cancel',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_SECONDARY,
            onClick: onClose,
          },
          {
            label: 'Change',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_PRIMARY,
            className: 'ml-1',
            loading: loading,
            disabled: !hasAvatarChanged,
            onClick: handleChange,
          },
        ],
      }}>
      <div className="p-4">
        {loading ? (
          <div className="">
            <Loader type={LoaderType.ELLIPSIS} />
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </FullWidthModal>
  )
}

export default ChangeAvatarPopup
