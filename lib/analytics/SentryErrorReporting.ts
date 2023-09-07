import { BrowserOptions } from '@sentry/react'
import { dynamicSentry, dynamicSentryTracingIntegrations } from '../../components/dynamicModules'
import { IUserInfo } from '../../interface/user'
import { ISentryErrorReporting } from './interface'
import appConfig from '../../config/appConfig'

class SentryErrorReporting implements ISentryErrorReporting {
  sentry: any | null = null

  private async _loadSentry(): Promise<any> {
    const sentry = await dynamicSentry()
    this.sentry = sentry
  }

  private async _loadTracingIntegrations(): Promise<any> {
    const integrations = await dynamicSentryTracingIntegrations()
    return integrations
  }

  public async init(): Promise<void> {
    await this._loadSentry()
    const integrations = await this._loadTracingIntegrations()

    const config: BrowserOptions = {
      dsn: appConfig.integrations.sentryErrorReporting.dsn,
      tracesSampleRate: 1.0,
      environment: appConfig.env,
      integrations: [new integrations.BrowserTracing()],
    }

    await this.sentry.init(config)
  }

  public setUser(userInfo: IUserInfo): void {
    this._loadSentry().then(() => {
      this._setUser(userInfo)
    })
  }

  public _setUser(userInfo: IUserInfo): void {
    if (this.sentry && userInfo) {
      this.sentry.setUser({
        id: userInfo.id,
        email: userInfo.email,
        username: userInfo.username,
      })
    }
  }

  public removeUser(): void {
    this.sentry.configureScope((scope: any) => scope.setUser(null))
  }

  public captureException(error: any, info?: any): void {
    if (this.sentry) {
      this.sentry.captureException(error, info)
    }
  }
}

const sentryErrorReporting = new SentryErrorReporting()
export default sentryErrorReporting
