import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getListPageUrl } from '../../routes'

export const prepareListPageSeo = (): IAppSeoProps => {
  return {
    title: `List`,
    description: `description`,
    canonical: `${appConfig.global.baseUrl}${getListPageUrl()}`,
    keywords: [],
  }
}
