import firebaseStore from '.'
import { collection, doc, getDoc, getDocs, limit, query, setDoc } from 'firebase/firestore'
import { IUserInfo } from '../../interface/applicationContext'

const usersCollection = collection(firebaseStore, 'users')

export const addUser = async (userInfo: IUserInfo) => {
  const docRef = await setDoc(doc(usersCollection, userInfo.username), userInfo)
  return docRef
}

interface IListUsersParams {
  limit: number
}

export const listUsers = async (params: IListUsersParams): Promise<IUserInfo[]> => {
  const q = query(usersCollection, limit(params.limit))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as IUserInfo)
}

export const getUserByUsername = async (username: string): Promise<IUserInfo | null> => {
  const docRef = doc(usersCollection, username)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as IUserInfo
  } else {
    return null
  }
}
