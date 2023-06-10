import { IUserInfo } from './user'

export enum RecommendationType {
  PRODUCT = 'PRODUCT',
  BLOG = 'BLOG',
  VIDEO = 'VIDEO',
  MUSIC = 'MUSIC',
  // BOOK = 'BOOK',
  // PODCAST = 'PODCAST',
  OTHER = 'OTHER',
}

export interface IRecommendationInfo {
  id: string
  url: string
  title: string
  description: string
  imageUrl: string
  isAdult: boolean
  createdAt: number | null // date mills
  type: RecommendationType
  owner: IUserInfo
}

export interface IListRecommendationInfo extends IRecommendationInfo {
  notes: string | null
  addedAt: number | null // date mills
}
