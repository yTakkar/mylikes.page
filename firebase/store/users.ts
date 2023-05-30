import firebaseStore from '.'
import { addDoc, collection } from 'firebase/firestore'
import { IUserInfo } from '../../interface/applicationContext'

const usersCollection = collection(firebaseStore, 'users')

export const addUser = async (userInfo: IUserInfo) => {
  const docRef = await addDoc(usersCollection, userInfo)
  return docRef
}
