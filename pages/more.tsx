import {
  UserIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LogoutIcon,
  PhoneIcon,
  LoginIcon,
  BookmarkIcon,
  HomeIcon,
} from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { GetStaticProps, NextPage } from 'next'
import React, { useContext } from 'react'
import { IGlobalLayoutProps } from './_app'
import classnames from 'classnames'
import PageContainer from '../components/PageContainer'
import CoreLink from '../components/core/CoreLink'
import { toastSuccess } from '../components/Toaster'
import {
  getContactPageUrl,
  getHomePageUrl,
  getPrivacyPageUrl,
  getSavedRecommendationsPageUrl,
  getTnCPageUrl,
} from '../utils/routes'
import { prepareHomePageSeo } from '../utils/seo/pages/home'
import { MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import ApplicationContext from '../components/ApplicationContext'
import { useRouter } from 'next/router'
import { PopupType } from '../interface/popup'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const MorePage: NextPage<IProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const { user, methods } = applicationContext

  const router = useRouter()

  const LINKS = [
    {
      label: 'Home',
      url: getHomePageUrl(),
      icon: HomeIcon,
      show: true,
    },
    {
      label: 'Profile',
      subTitle: 'Manage your profile and lists',
      url: getHomePageUrl(),
      icon: UserIcon,
      show: !!user,
    },
    {
      label: 'Saved Recommendations',
      url: getSavedRecommendationsPageUrl(),
      icon: BookmarkIcon,
      show: !!user,
    },
    {
      label: 'Login',
      subTitle: 'Login to sync your data',
      url: null,
      icon: LoginIcon,
      show: !user,
      onClick: () => {
        methods.togglePopup(PopupType.LOGIN, {})
      },
    },
    {
      label: 'Terms & Conditions',
      url: getTnCPageUrl(),
      icon: ShieldCheckIcon,
      show: true,
    },
    {
      label: 'Privacy Policy',
      url: getPrivacyPageUrl(),
      icon: DocumentTextIcon,
      show: true,
    },
    {
      label: 'Contact Us',
      url: getContactPageUrl(),
      icon: PhoneIcon,
      show: true,
    },
    {
      label: 'Logout',
      url: null,
      icon: LogoutIcon,
      show: !!user,
      onClick: () => {
        methods.updateUser(null)
        toastSuccess('Logged out')
        router.push(getHomePageUrl())
      },
    },
  ]

  return (
    <div>
      <MobileView>
        <Snackbar title="Explore" />
      </MobileView>

      <PageContainer>
        <div className="pb-8">
          {LINKS.map((link, index) => {
            const IconComponent = link.icon

            if (!link.show) {
              return null
            }

            return (
              <CoreLink
                key={index}
                url={link.url}
                onClick={() => {
                  if (link.onClick) {
                    link.onClick()
                  }
                }}
                className={classnames(
                  'flex items-center w-full p-4 lg:px-2 lg:py-5 transition-all bg-white hover:bg-gray-100 group',
                  {
                    'border-b border-gray-400': index + 1 !== LINKS.length,
                  }
                )}>
                <div className="mr-3">
                  <IconComponent className="w-6 text-typo-paragraphLight group-hover:text-typo-paragraph" />
                </div>

                <div className="flex flex-grow justify-between items-center">
                  <div>
                    <div className="text-gray-900 font-normal font-primary-medium">{link.label}</div>
                    <div className="text-sm text-gray-700">{link.subTitle}</div>
                  </div>
                  <div>
                    <ChevronRightIcon className="w-5 text-gray-700 transform transition-transform group-hover:scale-125" />
                  </div>
                </div>
              </CoreLink>
            )
          })}
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareHomePageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: false,
        },
      },
      analytics: null,
    },
  }
}

export default MorePage
