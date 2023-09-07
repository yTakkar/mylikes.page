import { AnalyticsCategoryType, AnalyticsEventType } from '../../constants/analytics'
import { IUserInfo } from '../../interface/user'

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
  pageView(params: IGAPageViewParams): Promise<void>
  setUser(userInfo: IUserInfo | null): void
  removeUser(): void
  event(params: IGAEventParams): void
}

export interface IMixPanelPageViewParams extends IAnalyticsPageViewParams {}

export interface IMixPanelEventParams extends IAnalyticsEventParams {}

export interface IMixPanel {
  init(): void
  pageView(params: IGAPageViewParams): Promise<void>
  setUser(userInfo: IUserInfo | null): void
  removeUser(): void
  event(params: IMixPanelEventParams): void
}

export interface ISentryErrorReporting {
  init(): void
  setUser(userInfo: IUserInfo | null): void
  removeUser(): void
  captureException(error: any, info?: any): void
}
