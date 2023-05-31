import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IUserInfo } from '../../../interface/applicationContext'
import { getProfilePageUrl } from '../../routes'

export const prepareProfilePageSeo = (profileInfo: IUserInfo): IAppSeoProps => {
  return {
    title: `${profileInfo.username} | ${profileInfo.name} | ${appConfig.global.app.name}`,
    description: `${profileInfo.name} description`,
    canonical: `${appConfig.global.baseUrl}${getProfilePageUrl(profileInfo)}`,
    imageUrl: profileInfo.avatarUrl,
    keywords: [],
    // structuredData: {
    //   product: prepareProductStructuredData(product),
    // },
  }
}
