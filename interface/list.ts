import { IRecommendationInfo } from './recommendation'
import { IUserInfo } from './user'

export enum ListVisibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface IListInfo {
  id: string
  name: string
  description: string
  createdAt: number // date mills
  visibility: ListVisibilityType
  recommendations: IListRecommendationInfo[]
  clonedListId: string | null
}

export interface IListDetail extends IListInfo {
  owner: IUserInfo
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
