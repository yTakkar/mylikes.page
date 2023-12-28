import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getAboutPageUrl } from '../../routes'

// http://localhost:3000/about
export const prepareAboutPageSeo = (): IAppSeoProps => {
  return {
    title: `About Us ${appConfig.seo.titleSuffix}`,
    description: `About Us ${appConfig.seo.titleSuffix}`,
    canonical: `${appConfig.global.baseUrl}${getAboutPageUrl()}`,
    keywords: [],
  }
}
