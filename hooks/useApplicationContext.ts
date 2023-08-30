import { useEffect } from 'react'
import { getDeviceInfo } from '../utils/applicationContext'
import useApplicationContextReducer from './useApplicationContextReducer'
import useOrientation from './useOrientation'
import { IContextMethods } from '../interface/applicationContext'
import { deleteLocalUserInfo, getLocalUserInfo, setLocalUserInfo } from '../utils/user'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import appConfig from '../config/appConfig'
import { APP_LOGO } from '../constants/constants'

const useApplicationContext = () => {
  const { applicationContext, dispatchApplicationContext } = useApplicationContextReducer()
  const { isLandscapeMode } = useOrientation()

  useEffect(() => {
    dispatchApplicationContext({
      type: 'UPDATE_DEVICE',
      payload: getDeviceInfo(),
    })
  }, [isLandscapeMode, dispatchApplicationContext])

  const togglePopup: IContextMethods['togglePopup'] = (popup, params) => {
    dispatchApplicationContext({
      type: 'TOGGLE_POPUP',
      payload: {
        popup,
        params,
      },
    })
  }

  const updateUser: IContextMethods['updateUser'] = _userInfo => {
    const userInfo = _userInfo
    if (userInfo !== null) {
      if (appConfig.admin.users.includes(userInfo.email)) {
        userInfo!._isAdmin = true
        userInfo.avatarUrl = APP_LOGO.DEFAULT
      }
    }
    dispatchApplicationContext({
      type: 'UPDATE_USER',
      payload: userInfo,
    })
    deleteLocalUserInfo()
    if (userInfo !== null) {
      setLocalUserInfo(userInfo!)
    }
  }

  const logout: IContextMethods['logout'] = () => {
    updateUser(null)
    deleteLocalUserInfo()
    appAnalytics.setUser(null)
    appAnalytics.sendEvent({
      action: AnalyticsEventType.LOGOUT,
    })
  }

  useEffect(() => {
    const localUserInfo = getLocalUserInfo()
    if (localUserInfo) {
      updateUser(localUserInfo)
      appAnalytics.setUser(localUserInfo)
    }
  }, [])

  applicationContext.methods = {
    togglePopup,
    updateUser,
    logout,
    dispatch: dispatchApplicationContext,
  }

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContext
