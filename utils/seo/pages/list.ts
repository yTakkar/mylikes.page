import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IListDetail } from '../../../interface/list'
import { getListPageUrl } from '../../routes'

export const prepareListPageSeo = (listDetail: IListDetail): IAppSeoProps => {
  return {
    title: `${listDetail.name} ${appConfig.seo.titleSuffix}`,
    description: `A recommendations list created by ${listDetail.owner!.name} on ${appConfig.global.app.name}`,
    canonical: `${appConfig.global.baseUrl}${getListPageUrl(listDetail.id)}`,
    keywords: [listDetail.name, listDetail.owner!.name],
  }
}
