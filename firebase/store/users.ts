import firebaseStore from '.'
import { collection, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { IListUsersParams, IUserInfo } from '../../interface/user'

// Document reference: email
export const usersCollection = collection(firebaseStore, 'users')

export const getUserByEmail = async (email: string): Promise<IUserInfo | null> => {
  const docRef = doc(usersCollection, email)
  const docSnap = await getDoc(docRef)
  return (docSnap.data() as IUserInfo) || null
}

export const getUserByUsername = async (username: string): Promise<IUserInfo | null> => {
  const q = query(usersCollection, where('username', '==', username))
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
  await setDoc(doc(usersCollection, userInfo.email), userInfo)
  return userInfo
}

export const listUsers = async (params: IListUsersParams): Promise<IUserInfo[]> => {
  const q = query(usersCollection, limit(params.limit))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as IUserInfo)
}

export const usernameExists = async (username: string): Promise<boolean> => {
  const user = await getUserByUsername(username)
  return !!user
}

export const updateUser = async (email: string, partialUserInfo: Partial<IUserInfo>): Promise<null> => {
  await updateDoc(doc(usersCollection, email), partialUserInfo as any)
  return null
}
