import { useEffect } from 'react'
import { getDeviceInfo } from '../utils/applicationContext'
import useApplicationContextReducer from './useApplicationContextReducer'
import useOrientation from './useOrientation'
import { IContextMethods } from '../interface/applicationContext'
import { deleteLocalUserInfo, getLocalUserInfo, prepareUserInfo, setLocalUserInfo } from '../utils/user'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import { signInWithGoogle } from '../firebase/auth/auth'
import { addUser } from '../firebase/store/users'
import { isAdminUser, vibrate } from '../utils/common'
import { toastError, toastSuccess } from '../components/Toaster'

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
      if (isAdminUser(userInfo.email)) {
        userInfo!._isAdmin = true
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

  const login: IContextMethods['login'] = async onSuccess => {
    try {
      const user = await signInWithGoogle()
      const preparedUserInfo = await prepareUserInfo(user)
      const { userInfo, newUser } = await addUser(preparedUserInfo)
      vibrate()
      updateUser(userInfo)
      appAnalytics.setUser(userInfo)
      appAnalytics.sendEvent({
        action: newUser ? AnalyticsEventType.SIGNUP : AnalyticsEventType.LOGIN,
        extra: {
          method: 'Google',
        },
      })
      toastSuccess(newUser ? 'Signup successful!' : 'Login successful!')
      onSuccess?.(userInfo)
    } catch (e: any) {
      if (e.code !== 'auth/popup-closed-by-user') {
        appAnalytics.captureException(e)
        toastError('Failed to login!')
      }
    }
  }

  const logout: IContextMethods['logout'] = () => {
    updateUser(null)
    deleteLocalUserInfo()
    appAnalytics.removeUser()
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
    login,
    logout,
    dispatch: dispatchApplicationContext,
  }

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContext
