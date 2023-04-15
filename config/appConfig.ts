const app = {
  name: 'MyLikes',
  shortName: 'MyLikes',
  summary: 'A summary',
  key: 'MYLIKES', // should be uppercase
}

const appConfig = {
  // @ts-ignore
  isDev: process.env.ENV.includes('local'),
  env: process.env.ENV,
  global: {
    app: app,
    domain: process.env.ENV_DOMAIN,
    baseUrl: process.env.ENV_BASE_URL,
    assetBaseUrl: process.env.ENV_ASSETS_BASE_URL,
    cloudImageBaseUrl: process.env.ENV_CLOUD_IMAGE_BASE_URL,
    // apiResponseTimeout: 5 * 1000,
  },
  seo: {
    facebook: {
      pageId: process.env.ENV_SEO_FACEBOOK_PAGE_ID,
    },
    twitter: {
      username: process.env.ENV_SEO_TWITTER_USERNAME,
    },
  },
  pwa: {
    shortcuts: [
      {
        name: 'Search',
        short_name: 'Search',
        url: '/search?utm_source=pwa&utm_medium=shortcut',
      },
      {
        name: 'Catalogues',
        short_name: 'Catalogues',
        url: '/catalogue?utm_source=pwa&utm_medium=shortcut',
      },
    ],
    startUrl: '/?utm_source=pwa&utm_medium=homescreen',
    icons: {
      maskable: false, // make sure icons can be masked before setting to true
    },
  },
  app: {
    android: {
      name: '',
      id: '',
      storeUrl: '',
    },
    iOS: {
      name: '',
      id: '',
      storeUrl: '',
    },
  },
  features: {
    enablePageTransition: process.env.ENV_ENABLE_PAGE_TRANSITION === 'true',
    enableLandscapeMode: process.env.ENV_ENABLE_LANDSCAPE_MODE === 'true',
  },
  build: {
    pageRevalidateTimeInSec: {
      HOME: 15 * 60,
    },
    initialPageBuildCount: {},
  },
  integrations: {
    googleAnalytics: {
      enabled: process.env.ENV_INTEGRATION_GOOGLE_ANALYTICS_ENABLED === 'true',
      webCode: process.env.ENV_INTEGRATION_GOOGLE_ANALYTICS_WEB_CODE,
    },
    googleSiteVerification: {
      enabled: process.env.ENV_INTEGRATION_GOOGLE_SITE_VERIFICATION_ENABLED === 'true',
      code: process.env.ENV_INTEGRATION_GOOGLE_SITE_VERIFICATION_CODE,
    },
    sentryErrorReporting: {
      enabled: process.env.ENV_INTEGRATION_SENTRY_ENABLED === 'true',
      dsn: process.env.ENV_INTEGRATION_SENTRY_DSN,
    },
    imageTransformation: {
      enabled: process.env.ENV_INTEGRATION_CLOUDINARY_ENABLED === 'true',
      variants: {
        // square (1:1)
        SQUARE_300: 't_s_300', //c_fill,h_300,w_300
        SQUARE_150: 't_s_150', //c_fill,h_150,w_150
        SQUARE_500: 't_s_500', //c_fill,h_500,w_500

        // wide (16:9)
        WIDE_620: 't_w_620', // c_fill,w_620,h_350

        // full screen
        FULL_1280: 't_full_1280', // c_fill,w_1280
      },
    },
  },
  company: {
    name: 'MyLikes Pvt. Ltd.',
    contactNumber: '+918104570640',
    contactEmail: 'mylikes@gmail.com',
    address: {
      streetAddress: 'Zed Pearl, No 12, Domlur Layout',
      addressLocality: 'Mumbai, Maharashtra',
      addressRegion: 'India',
      postalCode: '400000',
    },
    socialLinks: [
      { type: 'TWITTER', url: 'https://twitter.com/ownStore_', name: 'Twitter', isExternal: true },
      { type: 'FACEBOOK', url: 'https://www.facebook.com/ownStoreFB', name: 'Facebook', isExternal: true },
      { type: 'INSTAGRAM', url: 'https://www.instagram.com/ownStore__/', name: 'Instagram', isExternal: true },
      {
        type: 'YOUTUBE',
        url: 'https://www.youtube.com/channel/UCp7xl0E-JtFQamoZNBO8yGw',
        name: 'YouTube',
        isExternal: true,
      },
      { type: 'WHATSAPP', url: 'https://wa.me/+919999999999', name: 'WhatsApp', isExternal: true },
      { type: 'MAIL', url: 'mailto:ownstoreonlinee@gmail.com', name: 'Mail', isExternal: true },
    ],
  },
}

export default appConfig
