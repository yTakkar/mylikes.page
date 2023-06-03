import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IUserInfo } from '../../../interface/applicationContext'
import { getProfileEditPageUrl, getProfilePageUrl } from '../../routes'

export const prepareProfilePageSeo = (profileInfo: IUserInfo): IAppSeoProps => {
  return {
    title: `${profileInfo.username} | ${profileInfo.name} | ${appConfig.global.app.name}`,
    description: `${profileInfo.name} description`,
    canonical: `${appConfig.global.baseUrl}${getProfilePageUrl(profileInfo)}`,
    imageUrl: profileInfo.avatarUrl,
    keywords: [],
    // TODO:
    // structuredData: {
    //   product: prepareProductStructuredData(product),
    // },
  }
}

export const prepareProfileEditPageSeo = (): IAppSeoProps => {
  return {
    title: `Edit profile`,
    description: `description`,
    canonical: `${appConfig.global.baseUrl}${getProfileEditPageUrl()}`,
    keywords: [],
  }
}
