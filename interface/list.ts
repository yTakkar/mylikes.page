import { IListRecommendationInfo } from './recommendation'
import { IUserInfo } from './user'

export enum ListVisibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface IListDetail {
  id: string
  name: string
  owner: IUserInfo
  createdAt: number | null // date mills
  visibility: ListVisibilityType
  recommendations: IListRecommendationInfo[]
}
