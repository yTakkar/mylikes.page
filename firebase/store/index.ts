import firebaseApp from '../init'
import { getFirestore } from 'firebase/firestore'

const firebaseStore = getFirestore(firebaseApp)
export default firebaseStore
