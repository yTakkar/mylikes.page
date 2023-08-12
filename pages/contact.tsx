import React from 'react'
import { MailIcon } from '@heroicons/react/solid'
import { GetStaticProps, NextPage } from 'next'
import BackTitle from '../components/BackTitle'
import CoreImage from '../components/core/CoreImage'
import CoreLink from '../components/core/CoreLink'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import appConfig from '../config/appConfig'
import { SOCIAL_ICONS_SRC_MAP } from '../constants/constants'
import { IGlobalLayoutProps } from './_app'
import { prepareContactPageSeo } from '../utils/seo/pages/contact'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ContactPage: NextPage<IProps> = () => {
  const INSTAGRAM_SOCIAL_LINK = appConfig.company.socialLinks.find(socialLink => socialLink.type === 'INSTAGRAM')
  const TWITTER_SOCIAL_LINK = appConfig.company.socialLinks.find(socialLink => socialLink.type === 'TWITTER')
  const FACEBOOK_SOCIAL_LINK = appConfig.company.socialLinks.find(socialLink => socialLink.type === 'FACEBOOK')

  const links = [
    {
      value: appConfig.company.contactEmail,
      iconComponent: MailIcon,
      url: `mailto:${appConfig.company.contactEmail}`,
      isExternal: false,
    },
    {
      value: `${INSTAGRAM_SOCIAL_LINK?.username}`,
      iconComponent: () => (
        <CoreImage url={SOCIAL_ICONS_SRC_MAP.INSTAGRAM} alt="" useTransparentPlaceholder className="w-6" />
      ),
      url: INSTAGRAM_SOCIAL_LINK?.url,
      isExternal: INSTAGRAM_SOCIAL_LINK?.isExternal,
    },
    {
      value: TWITTER_SOCIAL_LINK?.username,
      iconComponent: () => (
        <CoreImage url={SOCIAL_ICONS_SRC_MAP.TWITTER} alt="" useTransparentPlaceholder className="w-6" />
      ),
      url: TWITTER_SOCIAL_LINK?.url,
      isExternal: TWITTER_SOCIAL_LINK?.isExternal,
    },
    {
      value: FACEBOOK_SOCIAL_LINK?.username,
      iconComponent: () => (
        <CoreImage url={SOCIAL_ICONS_SRC_MAP.FACEBOOK} alt="" useTransparentPlaceholder className="w-6" />
      ),
      url: FACEBOOK_SOCIAL_LINK?.url,
      isExternal: FACEBOOK_SOCIAL_LINK?.isExternal,
    },
  ]

  return (
    <div>
      <MobileView>
        <Snackbar title="Contact Us" />
      </MobileView>

      <PageContainer>
        <DesktopView>
          <BackTitle title="Contact Us" />
        </DesktopView>

        <div className="md:max-w-[720px] mx-auto px-2 mt-5">
          <div className="text-center">
            <div className="text-typo-title font-medium font-primary-medium text-xl">Get in touch!</div>
            <div className="text-base text-typo-paragraphLight">Contact us for any queries or questions.</div>
          </div>

          <div className="mt-5">
            {links.map((link, index) => {
              const IconComponent = link.iconComponent

              const content = (
                <div className="flex items-start rounded border-gray400 p-3 mb-2 bg-white hover:bg-gray-100 text-typo-paragraphLight group cursor-pointer transition-all">
                  <div className="mr-2">
                    <IconComponent className="w-6 group-hover:text-typo-title" />
                  </div>
                  <div>{link.value}</div>
                </div>
              )

              if (!link.url) {
                return content
              }

              return (
                <CoreLink key={index} url={link.url} isExternal={link.isExternal}>
                  {content}
                </CoreLink>
              )
            })}
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareContactPageSeo(),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
  }
}

export default ContactPage
