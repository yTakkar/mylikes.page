import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { IShelfDetail } from '../../../interface/shelf'
import { getShelfPageUrl } from '../../routes'

export const prepareShelfPageSeo = (shelfDetail: IShelfDetail): IAppSeoProps => {
  return {
    title: `Shelf - ${shelfDetail.name}`,
    description: `description`,
    canonical: `${appConfig.global.baseUrl}${getShelfPageUrl(shelfDetail.id)}`,
    keywords: [],
  }
}
