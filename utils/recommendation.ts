import urlPase from 'url-parse'

export const generateRecommendationImageUrl = (url: string): string => {
  const { hostname } = urlPase(url, false)
  return `https://logo.clearbit.com/${hostname}?size=256`
}
