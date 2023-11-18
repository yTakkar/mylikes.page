import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import firebaseStore from '.'
import { IGetShelfByIdParams, IShelfDetail, IShelfInfo } from '../../interface/shelf'
import { listCollection } from './list'
import { IListDetail } from '../../interface/list'
import { getBulkUsers } from './users'
import { shuffle } from '../../utils/array'

const shelfCollection = collection(firebaseStore, 'shelves')

export const listShelfInfos = async (): Promise<IShelfInfo[]> => {
  const querySnapshot = await getDocs(shelfCollection)
  return querySnapshot.docs.map(doc => doc.data() as IShelfInfo)
}

export const getShelfById = async (id: string, params: IGetShelfByIdParams): Promise<IShelfDetail | null> => {
  const docRef = doc(shelfCollection, id)
  const docSnap = await getDoc(docRef)
  const data = docSnap.data() as IShelfDetail

  if (!data) {
    return null
  }

  const listIds = shuffle(data.listIds).slice(0, params.limit)
  const uniqueUserEmails = new Set<string>()

  const listQuery = query(listCollection, where('id', 'in', listIds))
  const lists = await getDocs(listQuery)

  const listInfos = lists.docs.map(doc => {
    const listInfo = doc.data() as IListDetail
    const email = listInfo.owner?.id

    if (email) {
      uniqueUserEmails.add(email)
    }

    return {
      ...listInfo,
      __ownerEmail: email,
      owner: null,
    }
  })

  const recommendationOwners = await getBulkUsers(Array.from(uniqueUserEmails))

  return {
    ...data,
    listIds,
    listInfos: listInfos.map(listInfo => {
      const owner = recommendationOwners[listInfo.__ownerEmail as string]
      return {
        ...listInfo,
        owner,
      }
    }),
  }
}
