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

export const getProfilePageUrl = (username: string) => {
  return `/profile/${username}`
}

export const getProfileEditPageUrl = () => {
  return `/profile/edit`
}

export const get404PageUrl = () => {
  return '/not-found'
}

export const getListPageUrl = (listId: string) => {
  return `/list/${listId}`
}

export const getSavedRecommendationsPageUrl = () => {
  return `/saved-recommendations`
}

export const getShelfPageUrl = (shelfId: string) => {
  return `/shelf/${shelfId}`
}

export const getMostPopularRecommendationsPageUrl = () => {
  return `/most-popular-recommendations`
}
