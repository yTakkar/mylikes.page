import React from 'react'
import CoreImage from '../core/CoreImage'
import { MenuIcon as MenuIconSolid, UserIcon as UserIconSolid, PlusIcon as PlusIconSolid } from '@heroicons/react/solid'
import {
  MenuIcon as MenuIconOutline,
  UserIcon as UserIconOutline,
  PlusIcon as PlusIconOutline,
} from '@heroicons/react/outline'
import HeaderSearch from './HeaderSearch'
import CoreLink from '../core/CoreLink'
import usePWAInstall from '../../hooks/usePWAInstall'
import { APP_LOGO } from '../../constants/constants'
import HeaderLinks, { IHeaderLink } from './HeaderLinks'
import { DesktopView } from '../ResponsiveViews'
import { getHomePageUrl, getMorePageUrl, getSearchPageUrl } from '../../utils/routes'

interface INavbarProps {
  topNavVisibility: boolean
}

const Header: React.FC<INavbarProps> = props => {
  const { topNavVisibility } = props
  const { showPWAInstall, showPWAInstallPrompt } = usePWAInstall()

  const pwaInstallLink: IHeaderLink = {
    label: 'Install',
    url: null,
    iconComponent: PlusIconOutline,
    activeIconComponent: PlusIconSolid,
    iconClassName: 'animation-shakeX w-[28px]',
    count: null,
    onClick: e => {
      e.preventDefault()
      showPWAInstallPrompt()
    },
  }

  const NAV_LINKS: IHeaderLink[] = [
    {
      label: 'Search',
      url: getSearchPageUrl(),
      iconComponent: UserIconOutline,
      activeIconComponent: UserIconSolid,
      iconClassName: null,
      count: null,
      onClick: null,
    },
    {
      label: 'Other Links',
      url: getMorePageUrl(),
      iconComponent: MenuIconOutline,
      activeIconComponent: MenuIconSolid,
      iconClassName: null,
      count: null,
      onClick: null,
    },
  ]

  if (showPWAInstall) {
    NAV_LINKS.unshift(pwaInstallLink)
  }

  const renderTopNav = () => {
    return (
      <div>
        <nav className="top-nav lg:flex fixed top-0 left-0 right-0 bg-white shadow-md px-3 lg:px-4 py-3 z-10">
          <div className="container mx-auto">
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center w-9/12 md:w-10/12 lg:w-auto">
                <CoreLink url={getHomePageUrl()} className="mr-6">
                  <CoreImage url={APP_LOGO.DEFAULT} alt="App Logo" disableLazyload className="w-11 h-11" />
                </CoreLink>

                <DesktopView useCSS>
                  <div className="w-96">
                    <HeaderSearch />
                  </div>
                </DesktopView>
              </div>

              <div style={{ display: 'inherit' }}>
                <HeaderLinks links={NAV_LINKS} />
              </div>
            </div>
          </div>
        </nav>

        <div className="h-20" />
      </div>
    )
  }

  return <div>{topNavVisibility ? renderTopNav() : null}</div>
}

export default Header
