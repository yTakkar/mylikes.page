import { use, useEffect } from 'react'
import { getDeviceInfo } from '../utils/applicationContext'
import useApplicationContextReducer from './useApplicationContextReducer'
import useOrientation from './useOrientation'
import { IContextMethods } from '../interface/applicationContext'
import { deleteLocalUserInfo, getLocalUserInfo, setLocalUserInfo } from '../utils/user'

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

  const updateUser: IContextMethods['updateUser'] = userInfo => {
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
  }

  useEffect(() => {
    const localUserInfo = getLocalUserInfo()
    if (localUserInfo) {
      updateUser(localUserInfo)
    }
  }, [])

  applicationContext.methods = {
    togglePopup,
    updateUser,
    logout,
  }

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContext
