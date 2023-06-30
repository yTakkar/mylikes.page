import appConfig from '../config/appConfig'

export const revalidateUrl = async (url: string) => {
  const res = await fetch(`/api/revalidate?secret=${appConfig.cache.revalidateCacheKey}&url=${url}`)
  const json = await res.json()
  return json
}
