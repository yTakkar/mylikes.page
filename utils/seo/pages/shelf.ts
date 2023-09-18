import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IShelfDetail } from '../../../interface/shelf'
import { getShelfPageUrl } from '../../routes'

export const prepareShelfPageSeo = (shelfDetail: IShelfDetail): IAppSeoProps => {
  return {
    title: `${shelfDetail.name} ${appConfig.seo.titleSuffix}`,
    description: `Check out ${shelfDetail.name} on ${appConfig.global.app.name}`,
    canonical: `${appConfig.global.baseUrl}${getShelfPageUrl(shelfDetail.id)}`,
    keywords: [shelfDetail.name],
  }
}
