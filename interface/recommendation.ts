export enum RecommendationType {
  PRODUCT = 'PRODUCT', // blue #356cf4
  BLOG = 'BLOG', // black #191919
  VIDEO = 'VIDEO', // red #FF0000
  AUDIO = 'AUDIO', // green #1CD670
  // BOOK = 'BOOK',
  // PODCAST = 'PODCAST',
  OTHER = 'OTHER', // gray #eaeaea
}

export interface IRecommendationInfo {
  id: string
  url: string
  title: string
  imageUrl: string
  isAdult: boolean
  createdAt: number // date mills
  notes: string | null
  ownerEmail: string
}
