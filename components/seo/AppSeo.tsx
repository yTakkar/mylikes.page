import React from 'react'
import Head from 'next/head'
import {
  prepareOrganizationStructuredData,
  prepareWebpageStructuredData,
  prepareWebsiteStructuredData,
} from '../../utils/seo/structuredData'
import { SOCIAL_SHARE_BANNERS } from '../../constants/constants'
import appConfig from '../../config/appConfig'
import { prepareHomePageSeo } from '../../utils/seo/pages/home'
import { getRandomArrayItem } from '../../utils/array'

export interface IAppSeoProps {
  title: string
  description: string
  canonical: string
  keywords: string[]
  noIndex?: boolean
  noFollow?: boolean
  openGraph?: {
    title?: string
    description?: string
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image'
    title?: string
    description?: string
  }
  imageUrl?: string
}

const AppSeo: React.FC<IAppSeoProps> = props => {
  const {
    title: _title,
    description: _description,
    canonical,
    keywords,
    noFollow,
    noIndex,
    openGraph,
    twitter,
    // imageUrl: _imageUrl,
  } = props

  const defaultSeoData = prepareHomePageSeo()

  const title = _title || defaultSeoData.title
  const description = _description || defaultSeoData.description

  const shareBannerKeys = Object.keys(SOCIAL_SHARE_BANNERS)
  const randomKey = Number(getRandomArrayItem<string>(shareBannerKeys))
  const shareBanner = SOCIAL_SHARE_BANNERS[randomKey]

  const imageUrl = shareBanner

  const defaultKeywords = [
    appConfig.global.app.name,
    appConfig.global.app.name.toLowerCase(),
    'Recommendations platform',
    'Social recommendation network',
    'User-generated reviews',
    'Online community for recommendations',
    'Share your favorite products',
    'Personalized recommendation engine',
    'Affiliate marketing platform',
    'Curated recommendation lists',
    'Boost engagement with recommendations',
    'Discover trending recommendations',
    'Influencer marketing network',
    'Share and discover passions',
    'Expert insights on products',
    'Trusted product recommendations',
    'Build a following for your recommendations',
    'Explore user-generated content',
    'Share what you love with the world',
    'Connect with like-minded enthusiasts',
    'Explore top-rated recommendations',
    'Increase your influence through recommendations',
  ]

  return (
    <Head>
      <title key="title">{title}</title>
      <meta key="meta-title" name="title" content={title} />

      <meta key="description" name="description" content={description} />
      <meta key="keywords" name="keywords" content={(keywords || defaultKeywords).join(',')} />
      <meta
        key="robots"
        name="robots"
        content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`}
      />
      <meta
        key="googlebot"
        name="googlebot"
        content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`}
      />
      <link key="canonical" rel="canonical" href={canonical} />

      {/* OpenGraph */}
      <meta property="og:site_name" content={appConfig.global.app.name} />
      <meta property="og:type" key="og:type" content="website" />
      <meta key="og:title" property="og:title" content={openGraph?.title || title} />
      <meta key="og:description" property="og:description" content={openGraph?.description || description} />
      <meta key="og:image" property="og:image" content={imageUrl} />
      <meta key="og:url" property="og:url" content={canonical} />

      {/* Facebook */}
      {/* <meta property="fb:app_id" content={appConfig.integrations.facebookLogIn.code} /> */}
      <meta property="fb:pages" content={appConfig.seo.facebook.pageId} />

      {/* Twitter */}
      <meta name="twitter:site" content={appConfig.seo.twitter.username} />
      <meta key="twitter:card" name="twitter:card" content={twitter?.card || 'summary_large_image'} />
      <meta name="twitter:app:name:iphone" content={appConfig.app.iOS.name} />
      <meta name="twitter:app:id:iphone" content={appConfig.app.iOS.id} />
      <meta name="twitter:app:name:googleplay" content={appConfig.app.android.name} />
      <meta name="twitter:app:id:googleplay" content={appConfig.app.android.id} />
      <meta name="twitter:title" content={twitter?.title || title} />
      <meta name="twitter:description" content={twitter?.description || description} />
      <meta name="twitter:image" content={imageUrl}></meta>

      {/* Structured data */}
      <script
        key="organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(prepareOrganizationStructuredData()),
        }}></script>

      <script
        key="webSite"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(prepareWebsiteStructuredData()),
        }}></script>

      <script
        key="webPage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            prepareWebpageStructuredData({
              title: title,
              description: description,
              url: canonical,
            })
          ),
        }}></script>
    </Head>
  )
}

export default AppSeo
