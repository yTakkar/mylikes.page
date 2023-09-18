import appConfig from '../../config/appConfig'
import { APP_LOGO } from '../../constants/constants'

export const prepareOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: appConfig.company.name,
    url: appConfig.global.baseUrl,
    logo: APP_LOGO.DEFAULT,
    sameAs: appConfig.company.socialLinks
      .filter(socialLink => socialLink.url.startsWith('https://'))
      .map(socialLink => socialLink.url),
  }
}

export const prepareWebsiteStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: appConfig.global.baseUrl,
    // potentialAction: {
    //   '@type': 'SearchAction',
    //   target: {
    //     '@type': 'EntryPoint',
    //     urlTemplate: `${appConfig.global.baseUrl}/search?query={search_term_string}`,
    //   },
    //   'query-input': 'required name=search_term_string',
    // },
  }
}

export const prepareWebpageStructuredData = ({
  title,
  description,
  url,
}: {
  title: string
  description: string
  url: string
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: appConfig.global.app.name.toUpperCase(),
      url: appConfig.global.baseUrl,
      logo: {
        '@type': 'ImageObject',
        contentUrl: APP_LOGO.DEFAULT,
      },
    },
  }
}
