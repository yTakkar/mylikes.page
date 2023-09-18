import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getSavedRecommendationsPageUrl } from '../../routes'

export const prepareSavedRecommendationsPageSeo = (): IAppSeoProps => {
  return {
    title: `Saved Recommendations ${appConfig.seo.titleSuffix}`,
    description: `Your saved recommendations on ${appConfig.global.app.name}`,
    canonical: `${appConfig.global.baseUrl}${getSavedRecommendationsPageUrl()}`,
    keywords: [],
    noFollow: true,
    noIndex: true,
  }
}
