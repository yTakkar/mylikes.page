import appConfig from '../config/appConfig'
import { decode, encode } from './storage'

const key = `${appConfig.global.app.key}-AD_NOTIFICATION_SHOWN`

export const isAdNotificationShown = (): boolean => {
  const storageValue = localStorage.getItem(key)
  if (storageValue) {
    if (decode(storageValue) === 'true') return true
  }
  return false
}

export const setAdNotificationShown = (value: boolean): void => {
  localStorage.setItem(key, encode(`${value}`))
}
