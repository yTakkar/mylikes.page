import React, { useContext } from 'react'
import { MenuIcon as MenuIconSolid, DownloadIcon as DownloadIconSolid } from '@heroicons/react/solid'
import {
  MenuIcon as MenuIconOutline,
  DownloadIcon as DownloadIconOutline,
  UserCircleIcon as UserCircleIconOutline,
} from '@heroicons/react/outline'
import CoreLink from '../core/CoreLink'
import usePWAInstall from '../../hooks/usePWAInstall'
import HeaderLinks, { IHeaderLink } from './HeaderLinks'
import { getHomePageUrl, getMorePageUrl, getProfilePageUrl } from '../../utils/routes'
import ApplicationContext from '../ApplicationContext'
import TextLogo from '../logo/TextLogo'
import HeaderProfileIcon from './HeaderProfileIcon'

interface INavbarProps {
  topNavVisibility: boolean
}

const Header: React.FC<INavbarProps> = props => {
  const { topNavVisibility } = props
  const { showPWAInstall, showPWAInstallPrompt } = usePWAInstall()

  const applicationContext = useContext(ApplicationContext)
  const {
    user,
    methods,
    device: { isMobile },
  } = applicationContext

  const pwaInstallLink: IHeaderLink = {
    label: isMobile ? null : 'Install',
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
      label: isMobile ? null : user?.name || '',
      url: getProfilePageUrl(user?.username || ''),
      iconComponent: ({ className }) => <HeaderProfileIcon className={className} active={false} />,
      activeIconComponent: ({ className }) => <HeaderProfileIcon className={className} active />,
      iconClassName: null,
      count: null,
      onClick: () => null,
      show: !!user,
    },
    {
      label: isMobile ? null : 'Login',
      url: null,
      iconComponent: UserCircleIconOutline,
      activeIconComponent: null,
      iconClassName: null,
      count: null,
      onClick: e => {
        e.preventDefault()
        methods.login()
      },
      show: !user,
      tooltipContent: 'Login with Google',
    },
    {
      label: null,
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
