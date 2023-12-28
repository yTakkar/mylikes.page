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

export const getTnCPageUrl = () => {
  return '/terms-conditions'
}

export const getAboutPageUrl = () => {
  return '/about'
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

export const getFeaturedListsPageUrl = () => {
  // return getShelfPageUrl('featured-lists')
  return '/featured-lists'
}

export const getMostPopularRecommendationsPageUrl = () => {
  return `/most-popular-recommendations`
}
