import { collection, getDocs } from 'firebase/firestore'
import firebaseStore from '.'
import { IShelfInfo } from '../../interface/shelf'

const shelfCollection = collection(firebaseStore, 'shelves')

export const listShelfInfos = async (): Promise<IShelfInfo[]> => {
  const querySnapshot = await getDocs(shelfCollection)
  return querySnapshot.docs.map(doc => doc.data() as IShelfInfo)
}
