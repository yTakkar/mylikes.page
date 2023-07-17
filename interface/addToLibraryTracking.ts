export interface IAddToLibraryTrackingInfo {
  id: string // `${listId}-${listRecommendationId}`
  listId: string
  clonedListId: string
  clonedListName: string
  addedAt: number | null // date mills
}

export interface IAddToLibraryTrackingParams {
  listId: string
  clonedListId: string
  clonedListName: string
  addedAt: number | null // date mills
}
