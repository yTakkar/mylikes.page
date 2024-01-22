import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { IGlobalLayoutProps } from './_app'
import { DesktopView, MobileView } from '../components/ResponsiveViews'
import Snackbar from '../components/header/Snackbar'
import PageContainer from '../components/PageContainer'
import BackTitle from '../components/BackTitle'
import { prepareAboutPageSeo } from '../utils/seo/pages/about'
import CoreImage from '../components/core/CoreImage'
import CoreLink from '../components/core/CoreLink'
import CoreDivider from '../components/core/CoreDivider'
import appConfig from '../config/appConfig'
import useScrollToTop from '../hooks/useScrollToTop'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const AboutPage: NextPage<IProps> = () => {
  useScrollToTop()

  const links = [
    {
      url: 'https://faiyaztakkar.dev',
      isExternal: true,
      label: 'Website',
    },
    {
      url: 'https://twitter.com/shtakkar',
      isExternal: true,
      label: 'Twitter',
    },
    {
      url: 'https://github.com/yTakkar',
      isExternal: true,
      label: 'GitHub',
    },
    {
      url: 'https://www.linkedin.com/in/faiyaz-s-413450118/',
      isExternal: true,
      label: 'LinkedIn',
    },
  ]

  const mail = appConfig.company.contactEmail

  return (
    <div>
      <MobileView>
        <Snackbar title={'About Us'} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={'About Us'} />
          </DesktopView>

          <div className="mt-4">
            <div className="html-body">
              <p>
                Built with love on weekends by{' '}
                <CoreLink url={appConfig.author.website} isExternal>
                  Faiyaz
                </CoreLink>
                !
              </p>

              <p>
                {`In the closing months of 2022, a simple idea led to the creation of MyLikes. I wanted to share my
                classical music playlist with friends, giving them a chance to engage with it, and most importantly, to
                track how each recommendation performed.`}
              </p>

              <p>
                {`Sure, existing platforms allowed sharing, but none were designed specifically for recommendations.
                That's where MyLikes steps in—it does one thing exceptionally well: it lets users share recommendations
                with a wealth of features. And here's the kicker — it's free forever.`}
              </p>

              <p>{`We're all about recommendations — pure and simple. 🌐`}</p>

              {/* <p>
                <b>How do we make money?</b> Whenever you click on a recommendation, we open a link ad in a new tab on
                every 5th click. This helps us pay for the servers and keep the lights on.
              </p> */}

              <p>
                {`Please don't hesitate to `}
                <CoreLink url={`mailto:${mail}`} isExternal>
                  reach out
                </CoreLink>
                {` if you have any questions or feedback. We would love to hear from you and are just an email away!`}
              </p>

              <CoreDivider className="my-10" />

              <div className="flex flex-col items-center py-4">
                <CoreImage url={'/images/author.jpeg'} alt="Faiyaz" className="w-20 rounded-full" />
                <div className="mt-2 font-bold text-primaryTextBold">Faiyaz</div>
                <div className="">{`- Let's connect! -`}</div>
                <div className="mt-1">
                  {links.map((link, index) => (
                    <CoreLink
                      key={index}
                      url={link.url}
                      isExternal={link.isExternal}
                      className="text-sm mx-1 border-dashed border-b border-funBlue text-funBlue">
                      {link.label}
                    </CoreLink>
                  ))}
                </div>
              </div>
            </div>
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
      seo: prepareAboutPageSeo(),
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
      ads: {
        stickyBanner: {
          show: {
            desktop: true,
            mobile: true,
          },
        },
      },
    },
  }
}

export default AboutPage
