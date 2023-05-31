import { Timestamp, collection, doc, getDoc } from 'firebase/firestore'
import firebaseStore from '.'
import { IStaticPageDetail } from '../../interface/static'

const staticCollection = collection(firebaseStore, 'static')

const getStaticDetail = async (ref: string): Promise<IStaticPageDetail> => {
  const docRef = doc(staticCollection, ref)
  const document = (await getDoc(docRef)).data() as IStaticPageDetail
  return {
    ...document,
    updatedDateTime: (document.updatedDateTime as unknown as Timestamp).toMillis(),
  }
}

export const getPrivacyPolicyDetail = (): Promise<IStaticPageDetail> => {
  return getStaticDetail('privacy-policy')
}

export const getTnCDetail = (): Promise<IStaticPageDetail> => {
  return getStaticDetail('terms-and-conditions')
}
