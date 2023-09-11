import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getMostPopularRecommendationsPageUrl } from '../../routes'

export const prepareMostPopularRecommendationsPageSeo = (): IAppSeoProps => {
  return {
    title: `Most popular recommendations`,
    description: `description`,
    canonical: `${appConfig.global.baseUrl}${getMostPopularRecommendationsPageUrl()}`,
    keywords: [],
  }
}
