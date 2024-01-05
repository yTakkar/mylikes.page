import appConfig from '../config/appConfig'
import { decode, encode } from './storage'

const key = `${appConfig.global.app.key}-COOKIE-BANNER-SHOWN__V2`

export const isCookieBannerShown = (): boolean => {
  const storageValue = localStorage.getItem(key)
  if (storageValue) {
    if (decode(storageValue) === 'true') return true
  }
  return false
}

export const setCookieBannerShown = (value: boolean): void => {
  localStorage.setItem(key, encode(`${value}`))
}
