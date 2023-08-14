import { dynamicSentry } from '../../components/dynamicModules'
import { IUserInfo } from '../../interface/user'
import { ISentryErrorReporting } from './interface'

class SentryErrorReporting implements ISentryErrorReporting {
  sentry: any | null = null

  private async _loadSentry(): Promise<any> {
    const sentry = await dynamicSentry()
    this.sentry = sentry
  }

  public async init(): Promise<void> {
    await this._loadSentry()
  }

  public setUser(userInfo: IUserInfo | null): void {
    this._loadSentry().then(() => {
      this._setUser(userInfo)
    })
  }

  public _setUser(userInfo: IUserInfo | null): void {
    if (this.sentry) {
      if (userInfo) {
        this.sentry.setUser({
          id: userInfo.id,
          email: userInfo.email,
          username: userInfo.username,
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
