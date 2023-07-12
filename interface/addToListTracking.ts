export interface IAddToListTrackingInfo {
  id: string // `${listId}-${listRecommendationId}`
  listId: string
  listRecommendationId: string
  targetListId: string
}
