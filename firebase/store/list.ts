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
} from 'firebase/firestore'
import firebaseStore from '.'
import { IListDetail, IListDetailAddParams, IListListsParams } from '../../interface/list'
import { usersCollection } from './users'
import { IUserInfo } from '../../interface/user'

const listCollection = collection(firebaseStore, 'list')

export const addList = async (listParams: IListDetailAddParams): Promise<void> => {
  await setDoc(doc(listCollection, listParams.id), {
    id: listParams.id,
    name: listParams.name,
    description: listParams.description,
    owner: doc(usersCollection, listParams.ownerEmail),
    createdAt: listParams.createdAt,
    visibility: listParams.visibility,
    recommendations: listParams.recommendations,
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
