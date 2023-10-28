import { collection, doc, setDoc } from 'firebase/firestore'
import firebaseStore from '.'
import { IListBoostInvite } from '../../interface/listBootInvite'

const listBoostCollection = collection(firebaseStore, 'list-boost-invites')

export const addListBoostInvite = async (params: IListBoostInvite) => {
  await setDoc(doc(listBoostCollection, params.id), params)
}
