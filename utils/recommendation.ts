import urlPase from 'url-parse'

export const generateRecommendationImageUrl = (url: string): string => {
  const { hostname } = urlPase(url, false)

  const SHORT_LINKS_MAP: Record<string, string> = {
    'youtu.be': 'youtube.com',
    'bit.ly': 'bitly.com',
    'buff.ly': 'buffer.com',
    'goo.gl': 'google.com',
    'ift.tt': 'ifttt.com',
    'lnkd.in': 'linkedin.com',
    't.co': 'twitter.com',
    'fb.me': 'facebook.com',
    'wp.me': 'wordpress.com',
    'amzn.to': 'amazon.com',
    'x.com': 'twitter.com',
  }

  const domain = SHORT_LINKS_MAP[hostname] || hostname

  return `https://logo.clearbit.com/${domain}?size=256`
}

export const generateLogoByClearbit = (url: string): string => {
  const { hostname } = urlPase(url, false)

  const SHORT_LINKS_MAP: Record<string, string> = {
    'youtu.be': 'youtube.com',
    'bit.ly': 'bitly.com',
    'buff.ly': 'buffer.com',
    'goo.gl': 'google.com',
    'ift.tt': 'ifttt.com',
    'lnkd.in': 'linkedin.com',
    't.co': 'twitter.com',
    'fb.me': 'facebook.com',
    'wp.me': 'wordpress.com',
    'amzn.to': 'amazon.com',
    'x.com': 'twitter.com',
  }

  const domain = SHORT_LINKS_MAP[hostname] || hostname

  return `https://logo.clearbit.com/${domain}?size=256`
}

export const generateLogoByGoogle = (url: string): string => {
  const { hostname } = urlPase(url, false)
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=256`
}

export const generateLogoByYandex = (url: string): string => {
  const { hostname } = urlPase(url, false)
  return `https://favicon.yandex.net/favicon/${hostname}&size=256`
}

export const generateLogoByDuckDuckGo = (url: string): string => {
  const { hostname } = urlPase(url, false)
  return `https://icons.duckduckgo.com/ip3/${hostname}.ico`
}
