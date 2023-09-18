import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IListDetail } from '../../../interface/list'
import { IUserInfo } from '../../../interface/user'
import { getProfileEditPageUrl, getProfilePageUrl } from '../../routes'

export const prepareProfilePageSeo = (profileInfo: IUserInfo, lists: IListDetail[]): IAppSeoProps => {
  return {
    title: `${profileInfo.name} (@${profileInfo.username}) ${appConfig.seo.titleSuffix}`,
    description: `${lists.length} recommendation lists by ${profileInfo.name} on ${appConfig.global.app.name}`,
    canonical: `${appConfig.global.baseUrl}${getProfilePageUrl(profileInfo.username)}`,
    // imageUrl: profileInfo.avatarUrl,
    keywords: [profileInfo.name, profileInfo.username],
  }
}

export const prepareProfileEditPageSeo = (): IAppSeoProps => {
  return {
    title: `Edit profile ${appConfig.seo.titleSuffix}`,
    description: `Edit your profile on ${appConfig.global.app.name}`,
    canonical: `${appConfig.global.baseUrl}${getProfileEditPageUrl()}`,
    keywords: [],
    noFollow: true,
    noIndex: true,
  }
}
