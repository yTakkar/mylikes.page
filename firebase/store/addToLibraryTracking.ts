import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import firebaseStore from '.'
import { IAddToLibraryTrackingInfo, IAddToLibraryTrackingParams } from '../../interface/addToLibraryTracking'

const trackingCollection = collection(firebaseStore, 'add-to-library-tracking')

export const trackAddToLibrary = async (params: IAddToLibraryTrackingParams): Promise<void> => {
  const id = `${params.clonedListId}`
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

export const getAddToLibraryTrackingsByList = async (listId: string): Promise<IAddToLibraryTrackingInfo[]> => {
  const q = query(trackingCollection, where('listId', '==', listId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as IAddToLibraryTrackingInfo)
}
