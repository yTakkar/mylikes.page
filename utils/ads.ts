import appConfig from '../config/appConfig'
import { getRandomArrayItem } from './array'

export const getLinkAd = () => {
  const links = [appConfig.ads.adsTerra.directLink, appConfig.ads.monetag.directLink]
  return getRandomArrayItem(links)
}

export const shouldOpenRecommendationLinkAd = () => {
  const LOCAL_STORAGE_KEY = `SHOULD_OPEN_RECOMMENDATION_LINK_AD__V2`
  const FREQUENCY = appConfig.ads.recommendationLinkAdFrequency

  const localValue = localStorage.getItem(LOCAL_STORAGE_KEY)
  const value: number = localValue ? JSON.parse(localValue) : 0

  const newValue = value + 1

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue))

  if (value === 0 || newValue % FREQUENCY === 0) {
    return true
  }

  return false
}
