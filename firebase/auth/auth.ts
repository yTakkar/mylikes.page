import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const provider = new GoogleAuthProvider()

const auth = getAuth()
auth.useDeviceLanguage()
