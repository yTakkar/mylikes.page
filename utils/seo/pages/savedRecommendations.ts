import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getSavedRecommendationsPageUrl } from '../../routes'

export const prepareSavedRecommendationsPageSeo = (): IAppSeoProps => {
  return {
    title: `Saved Recommendations`,
    description: `description`,
    canonical: `${appConfig.global.baseUrl}${getSavedRecommendationsPageUrl()}`,
    keywords: [],
  }
}
