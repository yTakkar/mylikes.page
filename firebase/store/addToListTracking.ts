import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import firebaseStore from '.'
import { IAddToListTrackingInfo, IAddToListTrackingParams } from '../../interface/addToListTracking'

const trackingCollection = collection(firebaseStore, 'add-to-list-tracking')

export const trackAddToList = async (params: IAddToListTrackingParams): Promise<void> => {
  const id = `${params.listId}-${params.listRecommendationId}`
  const docRef = doc(trackingCollection, id)
  await setDoc(
    docRef,
    {
      id,
      ...params,
    },
    {
      merge: true,
    }
  )
}

export const getAddToListTrackingsByList = async (listId: string): Promise<IAddToListTrackingInfo[]> => {
  const q = query(trackingCollection, where('listId', '==', listId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as IAddToListTrackingInfo)
}
