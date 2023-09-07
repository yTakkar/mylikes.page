import appConfig from '../../config/appConfig'
import { AnalyticsEventType } from '../../constants/analytics'
import { IUserInfo } from '../../interface/user'
import googleAnalytics from './GoogleAnalytics'
import { IAnalyticsEventParams, IAnalyticsPageViewParams } from './interface'
import mixPanelAnalytics from './MixPanelAnalytics'
import sentryErrorReporting from './SentryErrorReporting'

const init = async (): Promise<void> => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    await googleAnalytics.init()
  }
  if (appConfig.integrations.sentryErrorReporting.enabled) {
    await sentryErrorReporting.init()
  }
  if (appConfig.integrations.mixPanelAnalytics.enabled) {
    await mixPanelAnalytics.init()
  }
}

const sendPageView = (params: IAnalyticsPageViewParams) => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    googleAnalytics.pageView(params)
  }
  if (appConfig.integrations.mixPanelAnalytics.enabled) {
    mixPanelAnalytics.pageView(params)
  }
}

const setUser = (user: IUserInfo) => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    googleAnalytics.setUser(user)
  }
  if (appConfig.integrations.mixPanelAnalytics.enabled) {
    mixPanelAnalytics.setUser(user)
  }
  if (appConfig.integrations.sentryErrorReporting.enabled) {
    sentryErrorReporting.setUser(user)
  }
}

const removeUser = () => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    googleAnalytics.removeUser()
  }
  if (appConfig.integrations.mixPanelAnalytics.enabled) {
    mixPanelAnalytics.removeUser()
  }
  if (appConfig.integrations.sentryErrorReporting.enabled) {
    sentryErrorReporting.removeUser()
  }
}

const sendEvent = (params: IAnalyticsEventParams) => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    googleAnalytics.event(params)
  }
  if (appConfig.integrations.mixPanelAnalytics.enabled) {
    mixPanelAnalytics.event(params)
  }
}

const captureException = (error: any, info?: any) => {
  if (appConfig.integrations.googleAnalytics.enabled) {
    googleAnalytics.event({
      action: AnalyticsEventType.EXCEPTION,
      extra: {
        description: error,
      },
    })
  }
  if (appConfig.integrations.sentryErrorReporting.enabled) {
    mixPanelAnalytics.event({
      action: AnalyticsEventType.EXCEPTION,
      extra: {
        description: error,
      },
    })
  }
  if (appConfig.integrations.sentryErrorReporting.enabled) {
    sentryErrorReporting.captureException(error, info)
  }
}

const appAnalytics = {
  init: init,
  sendPageView: sendPageView,
  setUser: setUser,
  removeUser: removeUser,
  sendEvent: sendEvent,
  captureException: captureException,
}

export default appAnalytics
