import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getHomePageUrl } from '../../routes'

export const prepareHomePageSeo = (): IAppSeoProps => {
  return {
    title: `${appConfig.global.app.title}`,
    description: appConfig.global.app.description,
    canonical: `${appConfig.global.baseUrl}${getHomePageUrl()}`,
    keywords: [],
  }
}
