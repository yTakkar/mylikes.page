import { IAppSeoProps } from '../../../components/seo/AppSeo'
import { prepareHomePageSeo } from './home'

export const prepareOfflinePageSeo = (): IAppSeoProps => {
  return {
    ...prepareHomePageSeo(),
    noIndex: true,
    noFollow: true,
  }
}
