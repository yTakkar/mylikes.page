const app = {
  name: 'MyLikes',
  shortName: 'MyLikes',
  tagLine: 'Empower Your Recommendations, Elevate Your Influence with MyLikes',
  title: 'MyLikes - Share Recommendations, Discover Passions, and Build Community',
  description:
    'The ultimate platform to share your recommendations, expertise, and discoveries with the world. Curate personalized lists, add your favourite recommendations and engage with a vibrant community. Start sharing your passions today!',
  key: 'MYLIKES', // should be uppercase
}

const features = {
  enablePageTransition: process.env.ENV_ENABLE_PAGE_TRANSITION === 'true',
  enableLandscapeMode: process.env.ENV_ENABLE_LANDSCAPE_MODE === 'true',
  enablePWAPromotions: process.env.ENV_ENABLE_PWA_PROMOTIONS === 'true',
  enableAppPromotions: process.env.ENV_ENABLE_APP_PROMOTIONS === 'true',
  enablePagesPrefetching: process.env.ENV_ENABLE_PAGES_PREFETCHING === 'true',
  enableFeaturedLists: process.env.ENV_ENABLE_FEATURED_LISTS === 'true',
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
    avatarsBaseUrl: process.env.ENV_AVATARS_BASE_URL,
    // apiResponseTimeout: 5 * 1000,
  },
  cache: {
    revalidateCacheKey: process.env.ENV_REVALIDATE_CACHE_KEY,
  },
  seo: {
    titleSuffix: `• ${app.name}`,
    facebook: {
      pageId: process.env.ENV_SEO_FACEBOOK_PAGE_ID,
    },
    twitter: {
      username: process.env.ENV_SEO_TWITTER_USERNAME,
    },
  },
  pwa: {
    // shortcuts: [
    //   {
    //     name: 'Search',
    //     short_name: 'Search',
    //     url: '/search?utm_source=pwa&utm_medium=shortcut',
    //   },
    //   {
    //     name: 'Catalogues',
    //     short_name: 'Catalogues',
    //     url: '/catalogue?utm_source=pwa&utm_medium=shortcut',
    //   },
    // ],
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
  search: {
    placeholder: {
      header: `Search ${app.name}...`,
      page: 'Search for influencers, recommendations & more',
    },
  },
  features,
  firebase: {
    apiKey: process.env.ENV_FIREBASE_API_KEY,
    authDomain: process.env.ENV_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.ENV_FIREBASE_PROJECT_ID,
    storageBucket: process.env.ENV_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.ENV_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.ENV_FIREBASE_APP_ID,
    measurementId: process.env.ENV_FIREBASE_MEASUREMENT_ID,
  },
  analytics: {
    cacheInvalidationTimeInSec: 10 * 60,
  },
  share: {
    list: {
      title: `Checkout {{LIST_NAME}} on ${app.name}!`, // Dynamic keywords allowed: LIST_NAME, LIST_URL
    },
  },
  feedback: {
    generalFeedbackForm: 'https://forms.gle/kZ659D87vZyYQihs8',
    newRecommendationTypeForm: 'https://forms.gle/yaTZSii4AKEU4w6cA',
  },
  build: {
    pageRevalidateTimeInSec: {
      HOME: 60 * 60,
      PRIVACY_POLICY: 3 * 60 * 60, // 3 hours
      TERMS_CONDITIONS: 3 * 60 * 60, // 3 hours
      404: 60 * 60,
      ERROR: 60 * 60,
      PROFILE: 30 * 60,
      LIST: 30 * 60,
      SHELF: 30 * 60,
      CUSTOM: {
        MOST_POPULAR_RECOMMENDATIONS: 60 * 60,
      },
    },
    initialPageBuildCount: {
      PROFILE: 100,
      LIST: 100,
    },
  },
  integrations: {
    googleAnalytics: {
      enabled: process.env.ENV_INTEGRATION_GOOGLE_ANALYTICS_ENABLED === 'true',
      webCode: process.env.ENV_INTEGRATION_GOOGLE_ANALYTICS_WEB_CODE,
    },
    mixPanelAnalytics: {
      enabled: process.env.ENV_INTEGRATION_MIXPANEL_ANALYTICS_ENABLED === 'true',
      code: process.env.ENV_INTEGRATION_MIXPANEL_ANALYTICS_CODE,
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
    name: 'MyLikes',
    contactEmail: 'team@mylikes.page',
    socialLinks: [
      {
        type: 'TWITTER',
        url: 'https://twitter.com/mylikespage',
        name: 'Twitter',
        isExternal: true,
        username: 'mylikespage',
      },
      {
        type: 'FACEBOOK',
        url: 'https://www.facebook.com/mylikesFB',
        name: 'Facebook',
        isExternal: true,
        username: 'mylikesFB',
      },
      {
        type: 'INSTAGRAM',
        url: 'https://www.instagram.com/mylikes.page',
        name: 'Instagram',
        isExternal: true,
        username: 'mylikes.page',
      },
      // {
      //   type: 'YOUTUBE',
      //   url: 'https://www.youtube.com/channel/UCp7xl0E-JtFQamoZNBO8yGw',
      //   name: 'YouTube',
      //   isExternal: true,
      // },
      // { type: 'WHATSAPP', url: 'https://wa.me/+919999999999', name: 'WhatsApp', isExternal: true },
      { type: 'EMAIL', url: 'mailto:team@mylikes.page', name: 'Mail', isExternal: true },
    ],
  },
  footer: {
    links: [
      { label: 'Privacy Policy', url: '/privacy-policy' },
      { ...(features.enableFeaturedLists && { label: 'Featured Lists', url: '/featured-lists' }) },
      { label: 'Popular recommendations', url: '/most-popular-recommendations' },
    ].filter(Boolean),
    copyrightText: `&copy; ${new Date().getFullYear()} ${app.name}. All rights reserved`,
  },
  admin: {
    users: ['admin@mylikes.page', 'faiyaz@mylikes.page', 'team@mylikes.page', 'mylikescontact@gmail.com'],
  },
  ads: {
    featured: {
      listsRevalidateTimeInSec: 10 * 60,
      recommendationsFrequency: 5,
      listsFrequency: 3,
    },
  },
  customLists: {
    mostPopularRecommendationsCount: 100,
  },
}

export default appConfig
