import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getMostPopularRecommendationsPageUrl } from '../../routes'

export const prepareMostPopularRecommendationsPageSeo = (): IAppSeoProps => {
  return {
    title: `Most popular recommendations ${appConfig.seo.titleSuffix}`,
    description: `Check out the most popular recommendations on ${appConfig.global.app.name}!`,
    canonical: `${appConfig.global.baseUrl}${getMostPopularRecommendationsPageUrl()}`,
    keywords: ['most popular recommendations'],
  }
}
