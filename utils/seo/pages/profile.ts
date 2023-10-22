import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IListDetail } from '../../../interface/list'
import { IUserInfo } from '../../../interface/user'
import { getProfileEditPageUrl, getProfilePageUrl } from '../../routes'

export const prepareProfilePageSeo = (profileInfo: IUserInfo, lists: IListDetail[]): IAppSeoProps => {
  const title = `${profileInfo.name} (@${profileInfo.username}) ${appConfig.seo.titleSuffix}`
  const socialTitle = title

  const description = `${lists.length} recommendation lists by ${profileInfo.name} on ${appConfig.global.app.name}`
  const socialDescription = `Check out ${lists.length} recommendation lists by ${profileInfo.name} on ${appConfig.global.app.name}`

  return {
    title,
    description,
    canonical: `${appConfig.global.baseUrl}${getProfilePageUrl(profileInfo.username)}`,
    keywords: [profileInfo.name, profileInfo.username],
    openGraph: {
      title: socialTitle,
      description: socialDescription,
    },
    twitter: {
      title: socialTitle,
      description: socialDescription,
    },
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
