import { Dispatch, useReducer } from 'react'
import { defaultApplicationContext } from '../components/ApplicationContext'
import { IApplicationContextProps } from '../interface/applicationContext'
import { IDeviceInfo } from '../interface/device'
import { IUserInfo } from '../interface/user'
import { PopupParams, PopupType } from '../interface/popup'
import { IShelfDetail } from '../interface/shelf'

export type ApplicationContextAction =
  | {
      type: 'UPDATE_DEVICE'
      payload: IDeviceInfo
    }
  | {
      type: 'RESET'
    }
  | {
      type: 'UPDATE_USER'
      payload: IUserInfo | null
    }
  | {
      type: 'TOGGLE_POPUP'
      payload: {
        popup: PopupType
        params: PopupParams
      }
    }
  | {
      type: 'UPDATE_ADS_SHELF'
      payload: {
        shelf: IShelfDetail
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

    case 'UPDATE_USER': {
      return {
        ...state,
        user: action.payload,
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

    case 'UPDATE_ADS_SHELF': {
      const { shelf } = action.payload
      return {
        ...state,
        ads: {
          ...state.ads,
          featuredListsShelf: shelf,
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
