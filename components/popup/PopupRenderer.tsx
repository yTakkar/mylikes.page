import React, { useContext } from 'react'
import {
  DynamicAdNotificationPopup,
  DynamicAddRecommendationPopup,
  DynamicAddToListPopup,
  DynamicChangeAvatarPopup,
  DynamicCreateListPopup,
  DynamicEditRecommendationPopup,
  DynamicListAnalyticsPopup,
  DynamicLoginPopup,
} from '../dynamicComponents'
import ApplicationContext from '../ApplicationContext'
import { PopupType } from '../../interface/popup'

function PopupRenderer() {
  const applicationContext = useContext(ApplicationContext)
  const { popups, methods } = applicationContext

  const popupComponentMap: Record<PopupType, any> = {
    [PopupType.LOGIN]: DynamicLoginPopup,
    [PopupType.CHANGE_AVATAR]: DynamicChangeAvatarPopup,
    [PopupType.CREATE_LIST]: DynamicCreateListPopup,
    [PopupType.ADD_RECOMMENDATION]: DynamicAddRecommendationPopup,
    [PopupType.EDIT_RECOMMENDATION]: DynamicEditRecommendationPopup,
    [PopupType.ADD_TO_LIST]: DynamicAddToListPopup,
    [PopupType.LIST_ANALYTICS]: DynamicListAnalyticsPopup,
    [PopupType.AD_NOTIFICATION]: DynamicAdNotificationPopup,
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
