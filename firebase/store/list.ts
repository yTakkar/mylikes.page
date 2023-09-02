import {
  DocumentData,
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import firebaseStore from '.'
import { IListDetail, IListDetailAddParams, IListListsParams } from '../../interface/list'
import { getBulkUsers, usersCollection } from './users'
import { IUserInfo } from '../../interface/user'

export const listCollection = collection(firebaseStore, 'list')

export const addList = async (listParams: IListDetailAddParams): Promise<void> => {
  await setDoc(doc(listCollection, listParams.id), {
    id: listParams.id,
    name: listParams.name,
    description: listParams.description,
    owner: doc(usersCollection, listParams.ownerEmail),
    createdAt: listParams.createdAt,
    visibility: listParams.visibility,
    recommendations: listParams.recommendations,
    clonedListId: listParams.clonedListId,
  })
}

export const updateList = async (id: string, partialListParams: Partial<IListDetailAddParams>): Promise<null> => {
  await updateDoc(doc(listCollection, id), partialListParams as any)
  return null
}

export const listLists = async (params: IListListsParams) => {
  const q = query(listCollection, limit(params.limit))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as IListDetail)
}

export const listListsByClonedListId = async (clonedListId: string) => {
  const q = query(listCollection, where('clonedListId', '==', clonedListId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as IListDetail)
}

export const listListsByUser = async (user: IUserInfo): Promise<IListDetail[]> => {
  const userRef = doc(usersCollection, user.email)
  const q = query(listCollection, where('owner', '==', userRef))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => {
    const data = doc.data() as IListDetail
    return {
      ...data,
      owner: user,
    }
  })
}

export const getListProfileInfoMap = async (list: IListDetail) => {
  const uniqueUserEmails = new Set<string>()
  list.recommendations.forEach(recommendation => {
    uniqueUserEmails.add(recommendation.ownerEmail)
  })
  return getBulkUsers(Array.from(uniqueUserEmails))
}

export const getListById = async (id: string): Promise<IListDetail | null> => {
  const docRef = doc(listCollection, id)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) {
    return null
  }
  const data = docSnap.data() as IListDetail

  const ownerRef = (data as any).owner as DocumentReference<DocumentData>
  const ownerDocSnap = await getDoc(ownerRef)
  data.owner = ownerDocSnap.data() as IUserInfo

  return data
}

export const deleteListById = async (id: string): Promise<void> => {
  await deleteDoc(doc(listCollection, id))
}
