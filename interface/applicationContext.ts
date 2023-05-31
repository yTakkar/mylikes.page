import { SCREEN_SIZE } from '../constants/constants'

export type DEVICE_PROFILE = keyof typeof SCREEN_SIZE

export enum PlatformType {
  WEB = 'WEB',
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}

export enum PopupType {
  LOGIN = 'LOGIN',
}

export type PopupParams = any

export interface IDeviceInfo {
  isDesktop: boolean
  isMobile: boolean

  platform: PlatformType

  isApp: boolean
  isPwa: boolean

  isTouchDevice: boolean
  isLandscapeMode: boolean

  profile: DEVICE_PROFILE

  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  is2Xl: boolean
}

export interface IUserInfo {
  id: string
  username: string
  email: string
  name: string
  createdAt: Date
  avatarUrl: string
  bio: string | null
  websiteUrl: string | null
  socialUsernames: {
    twitter: string | null
    instagram: string | null
  }
}

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
