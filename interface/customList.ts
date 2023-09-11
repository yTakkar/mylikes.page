import { IListDetail, IListRecommendationInfo } from './list'

export interface IMostPopularRecommendation {
  id: string // listId-listRecommendationId
  list: IListDetail | null
  listRecommendation: IListRecommendationInfo | null
  clickCount: number
}

export interface IGetMostPopularRecommendationsParams {
  limit: number
}
