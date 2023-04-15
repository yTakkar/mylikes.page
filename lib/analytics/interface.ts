import { AnalyticsCategoryType, AnalyticsEventType } from '../../constants/analytics'

export interface IAnalyticsPageViewParams {
  pageTitle: string
  pagePath: string
}

export interface IAnalyticsEventParams {
  action: AnalyticsEventType
  category?: AnalyticsCategoryType
  label?: string
  extra?: {
    [key: string]: any
  }
}

export interface IGAPageViewParams extends IAnalyticsPageViewParams {}

export interface IGAEventParams extends IAnalyticsEventParams {}

export interface IGA {
  init(): void
  pageView(params: IGAPageViewParams): void
  setUser(userInfo: any | null): void
  event(params: IGAEventParams): void
}

export interface ISentryErrorReporting {
  init(): void
  setUser(userInfo: any | null): void
  captureException(error: any, info?: any): void
}
