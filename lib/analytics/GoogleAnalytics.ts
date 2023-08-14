import appConfig from '../../config/appConfig'
import { IUserInfo } from '../../interface/user'
import { getLocalUserInfo } from '../../utils/user'
import { IGA, IGAEventParams, IGAPageViewParams } from './interface'

class GoogleAnalytics implements IGA {
  public async init(): Promise<void> {
    const localUserInfo = getLocalUserInfo()
    if (localUserInfo) {
      await ga('config', {
        user_id: localUserInfo.id,
      })
    }
  }

  public pageView(params: IGAPageViewParams): void {
    const options = {
      page_title: params.pageTitle,
      page_location: `${appConfig.global.baseUrl}${params.pagePath}`,
      page_path: params.pagePath,
    }

    ga('event', 'page_view', options)
    ga('set', options)
  }

  public setUser(userInfo: IUserInfo | null): void {
    ga('set', {
      user_id: userInfo ? userInfo.id : '',
    })
  }

  public event(params: IGAEventParams): void {
    ga('event', params.action, {
      event_category: params.category || '',
      event_label: params.label || '',
      ...(params.extra || {}),
    })
  }
}

const googleAnalytics = new GoogleAnalytics()
export default googleAnalytics
