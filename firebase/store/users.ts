import firebaseStore from '.'
import { collection, doc, setDoc } from 'firebase/firestore'
import { IUserInfo } from '../../interface/applicationContext'

const usersCollection = collection(firebaseStore, 'users')

export const addUser = async (userInfo: IUserInfo) => {
  const docRef = await setDoc(doc(usersCollection, userInfo.username), userInfo)
  return docRef
}
