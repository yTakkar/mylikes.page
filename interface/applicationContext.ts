import { IDeviceInfo } from './device'
import { PopupParams, PopupType } from './popup'
import { IUserInfo } from './user'

export interface IContextMethods {
  togglePopup: (popup: PopupType, params: PopupParams) => void
  updateUser: (userInfo: IUserInfo | null) => void
  logout: () => void
}

export interface IApplicationContextProps {
  device: IDeviceInfo
  popups: Partial<Record<PopupType, PopupParams>>
  user: IUserInfo | null
  methods: IContextMethods
}
