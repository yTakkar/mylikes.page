import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import firebaseStore from '.'
import { IRecommendationInfo } from '../../interface/recommendation'

const savedCollection = collection(firebaseStore, 'saved-recommendations')

export const addSavedRecommendation = async (params: IRecommendationInfo): Promise<void> => {
  await setDoc(doc(savedCollection, params.id), {
    id: params.id,
    url: params.url,
    title: params.title,
    imageUrl: params.imageUrl,
    isAdult: params.isAdult,
    createdAt: params.createdAt,
    notes: params.notes,
    type: params.type,
    ownerEmail: params.ownerEmail,
  })
}

export const listSavedRecommendationsByEmail = async (userEmail: string): Promise<IRecommendationInfo[]> => {
  const q = query(savedCollection, where('ownerEmail', '==', userEmail))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as IRecommendationInfo)
}
