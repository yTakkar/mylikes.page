import firebaseStore from '.'
import { collection, doc, getDoc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { IListUsersParams, IUserInfo } from '../../interface/user'
import { IListRecommendationInfo } from '../../interface/list'

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

export const addUser = async (userInfo: IUserInfo): Promise<{ userInfo: IUserInfo; newUser: boolean }> => {
  const userWithSameEmail = await getUserByEmail(userInfo.email)
  if (userWithSameEmail) {
    return {
      userInfo: userWithSameEmail,
      newUser: false,
    }
  }
  await setDoc(doc(usersCollection, userInfo.email), userInfo)
  return {
    userInfo: userInfo,
    newUser: true,
  }
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

export const getBulkUsers = async (emails: string[]) => {
  const profileInfoMap: Record<string, IUserInfo> = {}

  if (emails.length === 0) {
    return profileInfoMap
  }

  const q = query(usersCollection, where('email', 'in', emails))
  const querySnapshot = await getDocs(q)
  querySnapshot.docs.forEach(doc => {
    const data = doc.data() as IUserInfo
    profileInfoMap[data.email] = data
  })
  return profileInfoMap
}
