import { IRecommendationInfo } from './recommendation'
import { IUserInfo } from './user'

export enum ListVisibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface IListDetail {
  id: string
  name: string
  description: string
  owner: IUserInfo
  createdAt: number // date mills
  visibility: ListVisibilityType
  recommendations: IListRecommendationInfo[]
  clonedListId: string | null
}

export interface IListDetailAddParams {
  id: string
  name: string
  description: string
  ownerEmail: string
  createdAt: number // date mills
  visibility: ListVisibilityType
  recommendations: IListRecommendationInfo[]
  clonedListId: string | null
}

export interface IListListsParams {
  limit: number
}

export interface IListRecommendationInfo extends IRecommendationInfo {
  addedAt: number // date mills
}
