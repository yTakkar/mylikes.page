import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IListDetail } from '../../../interface/list'
import { getListPageUrl } from '../../routes'

export const prepareListPageSeo = (listDetail: IListDetail): IAppSeoProps => {
  return {
    title: `List`,
    description: `description`,
    canonical: `${appConfig.global.baseUrl}${getListPageUrl(listDetail.id)}`,
    keywords: [],
  }
}
