import { useEffect } from 'react'
import { getDeviceInfo } from '../utils/applicationContext'
import useApplicationContextReducer from './useApplicationContextReducer'
import useOrientation from './useOrientation'

const useApplicationContext = () => {
  const { applicationContext, dispatchApplicationContext } = useApplicationContextReducer()

  const { isLandscapeMode } = useOrientation()

  useEffect(() => {
    dispatchApplicationContext({
      type: 'UPDATE_DEVICE',
      payload: getDeviceInfo(),
    })
  }, [isLandscapeMode, dispatchApplicationContext])

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContext
