import { IAppSeoProps } from '../../../components/seo/AppSeo'
import appConfig from '../../../config/appConfig'
import { SOCIAL_SHARE_BANNERS } from '../../../constants/constants'
import { IListDetail } from '../../../interface/list'
import { getRandomArrayItem } from '../../array'
import { getListPageUrl } from '../../routes'

export const prepareListPageSeo = (listDetail: IListDetail): IAppSeoProps => {
  const title = `${listDetail.name} ${appConfig.seo.titleSuffix}`
  const socialTitle = title

  const description = `A recommendations list created by ${listDetail.owner!.name} on ${appConfig.global.app.name}`
  const socialDescription = `${description}. Check it out!`

  const shareBannerKeys = Object.keys(SOCIAL_SHARE_BANNERS)
  const randomKey = Number(getRandomArrayItem<string>(shareBannerKeys))
  const shareBanner = SOCIAL_SHARE_BANNERS[randomKey]

  return {
    title,
    description,
    canonical: `${appConfig.global.baseUrl}${getListPageUrl(listDetail.id)}`,
    keywords: [listDetail.name, listDetail.owner!.name],
    openGraph: {
      title: socialTitle,
      description: socialDescription,
    },
    twitter: {
      title: socialTitle,
      description: socialDescription,
      card: 'summary_large_image',
    },
    imageUrl: shareBanner,
  }
}
