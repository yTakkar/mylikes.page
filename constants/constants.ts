import { ImageSourceType } from '../components/core/CoreImage'
import appConfig from '../config/appConfig'
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
