import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import firebaseStore from '.'
import { IGetShelfByIdParams, IShelfDetail, IShelfInfo } from '../../interface/shelf'
import { listCollection } from './list'
import { IListInfo } from '../../interface/list'
import { shuffle } from '../../utils/common'

const shelfCollection = collection(firebaseStore, 'shelves')

export const listShelfInfos = async (): Promise<IShelfInfo[]> => {
  const querySnapshot = await getDocs(shelfCollection)
  return querySnapshot.docs.map(doc => doc.data() as IShelfInfo)
}

export const getShelfById = async (id: string, params: IGetShelfByIdParams): Promise<IShelfDetail> => {
  const docRef = doc(shelfCollection, id)
  const docSnap = await getDoc(docRef)
  const data = docSnap.data() as IShelfDetail
  const listIds = shuffle(data.listIds).slice(0, params.limit)

  const listQuery = query(listCollection, where('id', 'in', listIds))
  const lists = await getDocs(listQuery)

  const listInfos = lists.docs.map(doc => {
    const listInfo = doc.data() as IListInfo
    return {
      ...listInfo,
      owner: null,
    }
  })

  return {
    ...data,
    listIds,
    listInfos,
  }
}
