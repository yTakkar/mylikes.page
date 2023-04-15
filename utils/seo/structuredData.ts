import appConfig from '../../config/appConfig'
import { APP_LOGO } from '../../constants/constants'

export const prepareOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: appConfig.company.name,
    url: appConfig.global.baseUrl,
    logo: APP_LOGO.DEFAULT,
    address: {
      '@type': 'PostalAddress',
      streetAddress: appConfig.company.address.streetAddress,
      addressLocality: appConfig.company.address.addressLocality,
      addressRegion: appConfig.company.address.addressRegion,
      postalCode: appConfig.company.address.postalCode,
      Telephone: appConfig.company.contactNumber,
    },
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${appConfig.global.baseUrl}/search?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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

export const prepareBreadcrumbListStructuredData = (
  list: {
    position: number
    name: string
    url: string
  }[]
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      item: {
        '@id': item.url,
        name: item.name,
      },
    })),
  }
}

export const prepareImageObjectStructuredData = (url: string, caption: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: url,
    caption: caption,
    license: appConfig.global.baseUrl,
  }
}

export const prepareFAQStructuredData = (entities: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entities.map(entitiy => ({
      '@type': 'Question',
      name: entitiy.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entitiy.answer,
      },
    })),
  }
}

/**
 * TODO: Faiyaz - Add
 *  - ViewAction: https://github.com/JayHoltslander/Structured-Data-JSON-LD#viewaction
 */
