import { ApplicationContextAction } from '../hooks/useApplicationContextReducer'
import { IDeviceInfo } from './device'
import { PopupParams, PopupType } from './popup'
import { IShelfDetail } from './shelf'
import { IUserInfo } from './user'

export interface IContextMethods {
  togglePopup: (popup: PopupType, params: PopupParams) => void
  updateUser: (userInfo: IUserInfo | null) => void
  login: () => Promise<void>
  logout: () => void
  dispatch: (action: ApplicationContextAction) => void
}

export interface IApplicationContextProps {
  device: IDeviceInfo
  popups: Partial<Record<PopupType, PopupParams>>
  user: IUserInfo | null
  ads: {
    featuredListsShelf: IShelfDetail | null
  }
  methods: IContextMethods
}
