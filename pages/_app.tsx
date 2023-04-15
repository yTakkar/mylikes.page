import React from 'react'
import 'styles/styles.scss'
import { NextPage } from 'next'
import ApplicationContext from '../components/ApplicationContext'
import { useRouter } from 'next/router'
import appConfig from '../config/appConfig'
import useApplicationContext from '../hooks/useApplicationContext'
import classnames from 'classnames'
import { DynamicPageTransition } from '../components/dynamicComponents'
import ErrorBoundary from '../components/error/ErrorBoundary'
import AppSeo, { IAppSeoProps } from '../components/seo/AppSeo'
import { national2Font } from '../utils/fonts'
import classNames from 'classnames'

export interface IPageLayoutData {}

export interface IGlobalLayoutProps {
  pageData: any
  seo: IAppSeoProps
  layoutData: IPageLayoutData
  analytics: any
}

interface IProps {
  Component: NextPage<IGlobalLayoutProps>
  pageProps: IGlobalLayoutProps
}

const MyApp: NextPage<IProps> = props => {
  const { Component, pageProps } = props
  const { seo } = pageProps || {}

  const { applicationContext } = useApplicationContext()
  const router = useRouter()

  return (
    <ApplicationContext.Provider value={applicationContext}>
      <AppSeo {...seo} />

      <main
        id={classnames('pageMain', {
          'pageMain-lock': appConfig.features.enableLandscapeMode,
        })}
        className={classNames('pb-16 lg:pb-0')}
        style={national2Font.style}>
        <ErrorBoundary key={router.route}>
          {appConfig.features.enablePageTransition ? (
            <DynamicPageTransition timeout={300} classNames="pageTransition">
              <Component {...pageProps} key={router.route} />
            </DynamicPageTransition>
          ) : (
            <Component {...pageProps} key={router.route} />
          )}
        </ErrorBoundary>
      </main>

      {/* <CookieBanner /> */}
      {/* <Toaster /> */}
      {/* {appConfig.features.enableScrollToTop ? <ScrollToTop /> : null} */}
      {/* {appConfig.features.enableLandscapeMode ? <OrientationLock /> : null} */}
    </ApplicationContext.Provider>
  )
}

export default MyApp
