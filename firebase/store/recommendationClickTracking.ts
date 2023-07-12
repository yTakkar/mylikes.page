import { collection, doc, increment, setDoc } from 'firebase/firestore'
import firebaseStore from '.'

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
