import { dynamicSentry, dynamicSentryTracingIntegrations } from '../../components/dynamicModules'
import appConfig from '../../config/appConfig'
import { ISentryErrorReporting } from './interface'
import { BrowserOptions } from '@sentry/browser'

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
      initialScope: {
        // user: {
        //   id: userId,
        // },
        // extra: {
        //   authToken: getAuthToken(),
        // },
      },
    }

    await this.sentry.init(config)
  }

  // TODO: User type here
  public setUser(userInfo: any | null): void {
    if (this.sentry) {
      if (userInfo) {
        this.sentry.setUser({
          id: userInfo.id,
          email: userInfo.email,
          ip: '{{auto}}',
        })
      } else {
        this.sentry.configureScope((scope: any) => scope.setUser(null))
      }
    }
  }

  public captureException(error: any, info?: any): void {
    if (this.sentry) {
      this.sentry.captureException(error, info)
    }
  }
}

const sentryErrorReporting = new SentryErrorReporting()
export default sentryErrorReporting
