import { collection, doc, getDoc } from 'firebase/firestore'
import firebaseStore from '.'
import { IStaticPageDetail } from '../../interface/static'

const staticCollection = collection(firebaseStore, 'static')

const getStaticDetail = async (ref: string): Promise<IStaticPageDetail> => {
  const docRef = doc(staticCollection, ref)
  return (await getDoc(docRef)).data() as IStaticPageDetail
}

export const getPrivacyPolicyDetail = (): Promise<IStaticPageDetail> => {
  return getStaticDetail('privacy-policy')
}

export const getTnCDetail = (): Promise<IStaticPageDetail> => {
  return getStaticDetail('terms-and-conditions')
}
