import React, { useContext } from 'react'
import { DynamicChangeAvatarPopup, DynamicLoginPopup } from '../dynamicComponents'
import ApplicationContext from '../ApplicationContext'
import { PopupType } from '../../interface/applicationContext'

function PopupRenderer() {
  const applicationContext = useContext(ApplicationContext)
  const { popups, methods } = applicationContext

  const popupComponentMap: Record<PopupType, any> = {
    [PopupType.LOGIN]: DynamicLoginPopup,
    [PopupType.CHANGE_AVATAR]: DynamicChangeAvatarPopup,
  }

  const popupMemo = (
    <div>
      {Object.keys(popups).map(popupId => {
        const popup = popupId as PopupType
        const Komponent = popupComponentMap[popup]
        const params = popups[popup]

        if (!params) {
          return null
        }

        return (
          <Komponent
            key={popupId}
            {...params}
            onClose={() => {
              methods.togglePopup(popup, null)
            }}
          />
        )
      })}
    </div>
  )

  return popupMemo
}

export default PopupRenderer
