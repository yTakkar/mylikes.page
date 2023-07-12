import { collection, doc, setDoc } from 'firebase/firestore'
import firebaseStore from '.'

const trackingCollection = collection(firebaseStore, 'add-to-list-tracking')

export const trackAddToList = async (
  listId: string,
  listRecommendationId: string,
  targetListId: string
): Promise<void> => {
  const id = `${listId}-${listRecommendationId}`
  const docRef = doc(trackingCollection, id)
  await setDoc(
    docRef,
    {
      id,
      listId,
      listRecommendationId,
      targetListId,
    },
    {
      merge: true,
    }
  )
}
