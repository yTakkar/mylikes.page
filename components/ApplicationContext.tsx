import React from 'react'
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

export interface IContextMethods {
  togglePopup: (popup: PopupType, params: PopupParams) => void
}

export interface IApplicationContextProps {
  device: IDeviceInfo
  popups: Partial<Record<PopupType, PopupParams>>
  methods: IContextMethods
}

export const defaultApplicationContext: IApplicationContextProps = {
  device: {
    isDesktop: true,
    isMobile: true,

    platform: PlatformType.WEB,

    isApp: false,
    isPwa: false,

    isTouchDevice: false,
    isLandscapeMode: false,

    profile: 'XL',

    isSm: true,
    isMd: false,
    isLg: false,
    isXl: false,
    is2Xl: false,
  },
  popups: {},
  methods: {
    togglePopup: () => null,
  },
}

const ApplicationContext = React.createContext<IApplicationContextProps>(defaultApplicationContext)

export default ApplicationContext
