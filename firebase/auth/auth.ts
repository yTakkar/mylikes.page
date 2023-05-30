import '../init'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const auth = getAuth()
auth.useDeviceLanguage()

export const signInWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider())
    .then(result => {
      return result.user
    })
    .catch(error => {
      throw error
    })
