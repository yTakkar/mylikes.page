export interface IAddToListTrackingInfo {
  id: string // `${listId}-${listRecommendationId}`
  listId: string
  listRecommendationId: string
  targetListId: string
  targetListName: string
  addedAt: number | null // date mills
}

export interface IAddToListTrackingParams {
  listId: string
  listRecommendationId: string
  targetListId: string
  targetListName: string
  addedAt: number | null // date mills
}
