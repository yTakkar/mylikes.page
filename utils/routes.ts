import { IUserInfo } from '../interface/applicationContext'

export const getHomePageUrl = () => {
  return '/'
}

export const getSearchPageUrl = () => {
  return '/search'
}

export const getMorePageUrl = () => {
  return '/more'
}

export const getPrivacyPageUrl = () => {
  return '/privacy-policy'
}

export const getContactPageUrl = () => {
  return '/contact'
}

export const getTnCPageUrl = () => {
  return '/terms-conditions'
}

export const getProfilePageUrl = (userInfo: IUserInfo) => {
  return `/profile/${userInfo?.username}`
}

export const get404PageUrl = () => {
  return '/not-found'
}
