import appConfig from '../config/appConfig'

export const revalidateUrl = async (urls: string[]) => {
  const res = await fetch(`/api/revalidate?secret=${appConfig.cache.revalidateCacheKey}&urls=${JSON.stringify(urls)}`)
  const json = await res.json()
  return json
}
