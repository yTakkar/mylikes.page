import React from 'react'
import { IApplicationContextProps } from '../interface/applicationContext'
import { PlatformType } from '../interface/device'

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
  user: null,
  ads: {
    featuredListsShelf: null,
  },
  methods: {
    togglePopup: () => null,
    updateUser: () => null,
    login: async () => {
      return
    },
    logout: () => null,
    dispatch: () => null,
  },
}

const ApplicationContext = React.createContext<IApplicationContextProps>(defaultApplicationContext)

export default ApplicationContext
