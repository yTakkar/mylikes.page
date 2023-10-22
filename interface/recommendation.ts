export enum RecommendationType {
  PRODUCT = 'PRODUCT',
  BLOG = 'BLOG',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
  // GAME = 'GAME',
  // BOOK = 'BOOK',
  // PODCAST = 'PODCAST',
  OTHER = 'OTHER',
}

export interface IRecommendationInfo {
  id: string
  url: string
  title: string
  imageUrl: string
  isAdult: boolean
  createdAt: number // date mills
  notes: string | null
  type: RecommendationType
  ownerEmail: string
}
