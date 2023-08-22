import { ImageSourceType } from '../components/core/CoreImage'
import appConfig from '../config/appConfig'
import { RecommendationType } from '../interface/recommendation'
import { prepareImageUrl } from '../utils/image'

export const SCREEN_SIZE = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}

// this map can have logos of multiple sizes
export const APP_LOGO = {
  DEFAULT: prepareImageUrl(`/images/logo.png`, ImageSourceType.ASSET),
  1920: prepareImageUrl(`/images/logo-1920.png`, ImageSourceType.ASSET),
}

export const LAZYIMAGE_PLACEHOLDER = prepareImageUrl('/images/lazyimage.png', ImageSourceType.ASSET)
export const LAZYIMAGE_PLACEHOLDER_TRANSPARENT = prepareImageUrl(
  '/images/lazyimage-transparent.png',
  ImageSourceType.ASSET
)

export const INITIAL_PAGE_BUILD_COUNT = appConfig.build.initialPageBuildCount
export const PAGE_REVALIDATE_TIME = appConfig.build.pageRevalidateTimeInSec

export const SOCIAL_ICONS_SRC_MAP: Record<string, string> = {
  EMAIL: prepareImageUrl('/images/icons/social/email.svg', ImageSourceType.ASSET),
  FACEBOOK: prepareImageUrl('/images/icons/social/facebook.svg', ImageSourceType.ASSET),
  INSTAGRAM: prepareImageUrl('/images/icons/social/instagram.svg', ImageSourceType.ASSET),
  LINKEDIN: prepareImageUrl('/images/icons/social/linkedin.svg', ImageSourceType.ASSET),
  TWITTER: prepareImageUrl('/images/icons/social/twitter.svg', ImageSourceType.ASSET),
  WHATSAPP: prepareImageUrl('/images/icons/social/whatsapp.svg', ImageSourceType.ASSET),
  YOUTUBE: prepareImageUrl('/images/icons/social/youtube.svg', ImageSourceType.ASSET),
  GLOBE: prepareImageUrl('/images/icons/social/globe.svg', ImageSourceType.ASSET),
}

export enum VibratePatternType {
  SHORT = 100,
  DEFAULT = 200,
  LONG = 500,
}

export const REGEX_MAP = {
  NAME: /^[^0-9]{3,50}$/,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  URL: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  NOT_EMPTY: /(.|\s)*\S(.|\s)*/,
}

export const RECOMMENDATION_TYPE_LABEL_MAP = {
  [RecommendationType.PRODUCT]: 'Online Product',
  [RecommendationType.BLOG]: 'Blog',
  [RecommendationType.VIDEO]: 'Video',
  [RecommendationType.MUSIC]: 'Music',
  [RecommendationType.OTHER]: 'Other',
}

export const RECOMMENDATION_TYPE_DESCRIPTION_MAP = {
  [RecommendationType.PRODUCT]: 'This is an online product recommendation',
  [RecommendationType.BLOG]: 'This is a blog recommendation',
  [RecommendationType.VIDEO]: 'This is a video recommendation',
  [RecommendationType.MUSIC]: 'This is a music recommendation',
  [RecommendationType.OTHER]: '',
}
