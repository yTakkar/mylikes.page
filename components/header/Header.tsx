import React, { useContext } from 'react'
import {
  MenuIcon as MenuIconSolid,
  PlusIcon as PlusIconSolid,
  LoginIcon as LoginIconSolid,
  DownloadIcon as DownloadIconSolid,
} from '@heroicons/react/solid'
import {
  MenuIcon as MenuIconOutline,
  PlusIcon as PlusIconOutline,
  LoginIcon as LoginIconOutline,
  DownloadIcon as DownloadIconOutline,
} from '@heroicons/react/outline'
import CoreLink from '../core/CoreLink'
import usePWAInstall from '../../hooks/usePWAInstall'
import HeaderLinks, { IHeaderLink } from './HeaderLinks'
import { getHomePageUrl, getMorePageUrl, getProfilePageUrl } from '../../utils/routes'
import ApplicationContext from '../ApplicationContext'
import { PopupType } from '../../interface/popup'
import TextLogo from '../logo/TextLogo'
import HeaderProfileIcon from './HeaderProfileIcon'

interface INavbarProps {
  topNavVisibility: boolean
}

const Header: React.FC<INavbarProps> = props => {
  const { topNavVisibility } = props
  const { showPWAInstall, showPWAInstallPrompt } = usePWAInstall()

  const applicationContext = useContext(ApplicationContext)
  const { user, methods } = applicationContext

  const pwaInstallLink: IHeaderLink = {
    label: 'Install',
    url: null,
    iconComponent: DownloadIconOutline,
    activeIconComponent: DownloadIconSolid,
    iconClassName: 'animation-shakeX',
    count: null,
    onClick: e => {
      e.preventDefault()
      showPWAInstallPrompt()
    },
    show: true,
    tooltipContent: 'Install the app',
  }

  const NAV_LINKS: IHeaderLink[] = [
    {
      label: 'Account',
      url: getProfilePageUrl(user!),
      iconComponent: ({ className }) => <HeaderProfileIcon className={className} active={false} />,
      activeIconComponent: ({ className }) => <HeaderProfileIcon className={className} active />,
      iconClassName: null,
      count: null,
      onClick: () => null,
      show: !!user,
    },
    {
      label: 'Login',
      url: null,
      iconComponent: LoginIconOutline,
      activeIconComponent: LoginIconSolid,
      iconClassName: null,
      count: null,
      onClick: e => {
        e.preventDefault()
        methods.togglePopup(PopupType.LOGIN, {})
      },
      show: !user,
    },
    {
      label: 'More',
      url: getMorePageUrl(),
      iconComponent: MenuIconOutline,
      activeIconComponent: MenuIconSolid,
      iconClassName: null,
      count: null,
      onClick: null,
      show: true,
    },
  ]

  if (showPWAInstall) {
    NAV_LINKS.unshift(pwaInstallLink)
  }

  const renderTopNav = () => {
    return (
      <div>
        <nav className="top-nav lg:flex fixed top-0 left-0 right-0 bg-white shadow-md px-3 lg:px-4 py-4 lg:py-5 z-10">
          <div className="container mx-auto">
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center w-7/12 md:w-10/12 lg:w-auto">
                <CoreLink url={getHomePageUrl()} className="mr-6">
                  <TextLogo />
                </CoreLink>

                {/* <DesktopView useCSS>
                  <div className="w-96">
                    <HeaderSearch />
                  </div>
                </DesktopView> */}
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
