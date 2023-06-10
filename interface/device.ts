import { SCREEN_SIZE } from '../constants/constants'

export type DEVICE_PROFILE = keyof typeof SCREEN_SIZE

export enum PlatformType {
  WEB = 'WEB',
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}

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
