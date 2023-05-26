import { IAppSeoProps } from '../../../components/seo/AppSeo'

export const prepareErrorPageSeo = (): IAppSeoProps => {
  return {
    title: '',
    description: '',
    canonical: '',
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}

export const prepareNotFoundPageSeo = (): IAppSeoProps => {
  return {
    title: '',
    description: '',
    canonical: '',
    keywords: [],
    noIndex: true,
    noFollow: true,
  }
}
