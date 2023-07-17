export interface IRecommendationClickInfo {
  id: string // listId-listRecommendationId
  listId: string
  listRecommendationId: string
  clickCount: number
}

export interface IRecommendationClickParams {
  listId: string
  listRecommendationId: string
}
