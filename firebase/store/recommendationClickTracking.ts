import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import firebaseStore from '.'
import { IRecommendationClickInfo, IRecommendationClickParams } from '../../interface/recommendationClickTracking'
import { IGetMostPopularRecommendationsParams, IMostPopularRecommendation } from '../../interface/customList'
import { getListById } from './list'
import { getBulkUsers } from './users'

const trackingCollection = collection(firebaseStore, 'recommendation-click-tracking')

export const trackRecommendationClick = async (
  params: IRecommendationClickParams,
  incrementCount = 1
): Promise<void> => {
  const id = `${params.listId}-${params.listRecommendationId}`
  const docRef = doc(trackingCollection, id)
  await setDoc(
    docRef,
    {
      id,
      listId: params.listId,
      listRecommendationId: params.listRecommendationId,
      clickCount: increment(incrementCount),
    },
    {
      merge: true,
    }
  )
}

export const getRecommendationClickTrackingsByList = async (listId: string): Promise<IRecommendationClickInfo[]> => {
  const q = query(trackingCollection, where('listId', '==', listId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as IRecommendationClickInfo)
}

export const removeRecommendationClickTracking = async (
  listId: string,
  listRecommendationId: string
): Promise<void> => {
  const id = `${listId}-${listRecommendationId}`
  const docRef = doc(trackingCollection, id)
  await deleteDoc(docRef)
}

export const getMostPopularRecommendations = async (
  params: IGetMostPopularRecommendationsParams
): Promise<IMostPopularRecommendation[]> => {
  const q = query(trackingCollection, orderBy('clickCount', 'desc'), limit(params.limit))
  const querySnapshot = await getDocs(q)
  const mostPopularRecommendations: IMostPopularRecommendation[] = []

  for (const doc of querySnapshot.docs) {
    const data = doc.data() as IRecommendationClickInfo
    const list = await getListById(data.listId)

    const recommendation = list ? list.recommendations.find(r => r.id === data.listRecommendationId) || null : null

    mostPopularRecommendations.push({
      id: data.id,
      clickCount: data.clickCount,
      list,
      listRecommendation: recommendation,
    })
  }

  return mostPopularRecommendations.sort((a, b) => b.clickCount - a.clickCount)
}

export const getPopularRecommendationsProfileInfoMap = async (popularRecommendations: IMostPopularRecommendation[]) => {
  const uniqueUserEmails = new Set<string>()

  popularRecommendations.forEach(popularRecommendation => {
    if (popularRecommendation.listRecommendation) {
      uniqueUserEmails.add(popularRecommendation.listRecommendation.ownerEmail)
    }
  })

  return getBulkUsers(Array.from(uniqueUserEmails))
}
