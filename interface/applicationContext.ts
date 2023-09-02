import { ApplicationContextAction } from '../hooks/useApplicationContextReducer'
import { IDeviceInfo } from './device'
import { IListDetail } from './list'
import { PopupParams, PopupType } from './popup'
import { IUserInfo } from './user'

export interface IContextMethods {
  togglePopup: (popup: PopupType, params: PopupParams) => void
  updateUser: (userInfo: IUserInfo | null) => void
  logout: () => void
  dispatch: (action: ApplicationContextAction) => void
}

export interface IApplicationContextProps {
  device: IDeviceInfo
  popups: Partial<Record<PopupType, PopupParams>>
  user: IUserInfo | null
  ads: {
    featuredLists: IListDetail[]
  }
  methods: IContextMethods
}
