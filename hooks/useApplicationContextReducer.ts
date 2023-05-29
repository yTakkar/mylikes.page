import { Dispatch, useReducer } from 'react'
import {
  defaultApplicationContext,
  IApplicationContextProps,
  IDeviceInfo,
  PopupParams,
  PopupType,
} from '../components/ApplicationContext'

export type ApplicationContextAction =
  | {
      type: 'UPDATE_DEVICE'
      payload: IDeviceInfo
    }
  | {
      type: 'RESET'
    }
  | {
      type: 'TOGGLE_POPUP'
      payload: {
        popup: PopupType
        params: PopupParams
      }
    }

const applicationReducer = (
  state: IApplicationContextProps,
  action: ApplicationContextAction
): IApplicationContextProps => {
  switch (action.type) {
    case 'UPDATE_DEVICE': {
      return {
        ...state,
        device: action.payload,
      }
    }

    case 'RESET': {
      const { device } = state
      return {
        ...defaultApplicationContext,
        device: device,
      }
    }

    case 'TOGGLE_POPUP': {
      const { popup, params } = action.payload
      return {
        ...state,
        popups: {
          [popup]: params,
        },
      }
    }

    default:
      return state
  }
}

const useApplicationContextReducer = (): {
  applicationContext: IApplicationContextProps
  dispatchApplicationContext: Dispatch<ApplicationContextAction>
} => {
  const [applicationContext, dispatchApplicationContext] = useReducer(applicationReducer, defaultApplicationContext)

  return {
    applicationContext,
    dispatchApplicationContext,
  }
}

export default useApplicationContextReducer
