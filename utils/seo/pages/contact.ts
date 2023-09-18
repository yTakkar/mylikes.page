import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { getContactPageUrl } from '../../routes'

// http://localhost:3000/contact
export const prepareContactPageSeo = (): IAppSeoProps => {
  return {
    title: 'Contact Us',
    description: 'Contact Us description',
    canonical: `${appConfig.global.baseUrl}${getContactPageUrl()}`,
    keywords: [],
    noFollow: true,
    noIndex: true,
  }
}
