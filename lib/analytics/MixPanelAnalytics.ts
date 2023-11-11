import { OverridedMixpanel } from 'mixpanel-browser'
import { dynamicMixPanel } from '../../components/dynamicModules'
import appConfig from '../../config/appConfig'
import { IUserInfo } from '../../interface/user'
import { IGAEventParams, IGAPageViewParams, IMixPanel } from './interface'

class MixPanelAnalytics implements IMixPanel {
  mixPanel: OverridedMixpanel | null = null

  private async _loadMixPanel(): Promise<any> {
    const mixPanel = await dynamicMixPanel()
    this.mixPanel = mixPanel as any
  }

  public async init(): Promise<void> {
    await this._loadMixPanel()

    if (this.mixPanel) {
      await this.mixPanel.init(appConfig.integrations.mixPanelAnalytics.code!, {
        debug: appConfig.isDev,
        track_pageview: false,
      })
    }
  }

  public async pageView(params: IGAPageViewParams): Promise<void> {
    await this.init()

    const options = {
      page: params.pageTitle,
      page_location: `${appConfig.global.baseUrl}${params.pagePath}`,
      page_path: params.pagePath,
    }

    if (this.mixPanel) {
      await this.mixPanel.track_pageview(options)
    }
  }

  public _setUser(userInfo: IUserInfo): void {
    if (this.mixPanel && userInfo) {
      this.mixPanel.identify(userInfo.id)
      this.mixPanel.people.set({
        $email: userInfo ? userInfo.email : '',
        $username: userInfo ? userInfo.username : '',
        $avatar: userInfo ? userInfo.avatarUrl : '',
        $createdAt: userInfo ? userInfo.createdAt : '',
      })
    }
  }

  public async setUser(userInfo: IUserInfo): Promise<void> {
    await this.init()

    this._loadMixPanel().then(() => {
      this._setUser(userInfo)
    })
  }

  public removeUser(): void {
    this.init()

    if (this.mixPanel) {
      this.mixPanel.reset()
    }
  }

  public event(params: IGAEventParams): void {
    this.init()

    if (this.mixPanel) {
      this.mixPanel.track(params.action, {
        ...(params.extra || {}),
      })
    }
  }
}

const mixPanelAnalytics = new MixPanelAnalytics()
export default mixPanelAnalytics
