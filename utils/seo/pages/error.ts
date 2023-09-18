import { IAppSeoProps } from '../../../components/seo/AppSeo'
import { prepareHomePageSeo } from './home'

export const prepareErrorPageSeo = (): IAppSeoProps => {
  return {
    ...prepareHomePageSeo(),
    noIndex: true,
    noFollow: true,
  }
}

export const prepareNotFoundPageSeo = (): IAppSeoProps => {
  return {
    ...prepareHomePageSeo(),
    noIndex: true,
    noFollow: true,
  }
}
