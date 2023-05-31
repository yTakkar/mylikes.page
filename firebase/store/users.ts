import firebaseStore from '.'
import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from 'firebase/firestore'
import { IUserInfo } from '../../interface/applicationContext'

const usersCollection = collection(firebaseStore, 'users')

export const getUserByEmail = async (email: string): Promise<IUserInfo | null> => {
  const q = query(usersCollection, where('email', '==', email))
  const querySnapshot = (await getDocs(q)).docs
  if (querySnapshot.length === 0) {
    return null
  }
  return querySnapshot[0].data() as IUserInfo
}

export const addUser = async (userInfo: IUserInfo): Promise<IUserInfo> => {
  const userWithSameEmail = await getUserByEmail(userInfo.email)
  if (userWithSameEmail) {
    return userWithSameEmail
  }
  await setDoc(doc(usersCollection, userInfo.username), userInfo)
  return userInfo
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
