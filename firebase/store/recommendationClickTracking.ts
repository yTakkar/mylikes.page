import { collection, deleteDoc, doc, getDocs, increment, query, setDoc, where } from 'firebase/firestore'
import firebaseStore from '.'
import { IRecommendationClickInfo } from '../../interface/recommendationClickTracking'

const trackingCollection = collection(firebaseStore, 'recommendation-click-tracking')

export const trackRecommendationClick = async (listId: string, listRecommendationId: string): Promise<void> => {
  const id = `${listId}-${listRecommendationId}`
  const docRef = doc(trackingCollection, id)
  await setDoc(
    docRef,
    {
      id,
      listId,
      listRecommendationId,
      clickCount: increment(1),
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
