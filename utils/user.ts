import { User } from 'firebase/auth'
import { IUserInfo } from '../interface/user'
import appConfig from '../config/appConfig'
import { getRandomAvatar } from './avatars'
import { dynamicUniqueNamesGenerator } from '../components/dynamicModules'

const key = `${appConfig.global.app.key}-USER-INFO`

export const getLocalUserInfo = (): IUserInfo | null => {
  const data = localStorage.getItem(key)
  if (data) {
    return JSON.parse(window.atob(data))
  }
  return null
}

export const setLocalUserInfo = (userInfo: IUserInfo) => {
  localStorage.setItem(key, window.btoa(JSON.stringify(userInfo)))
}

export const deleteLocalUserInfo = () => {
  localStorage.removeItem(key)
}

export const prepareUserInfo = async (user: User): Promise<IUserInfo> => {
  const uniqueNamesGenerator = await dynamicUniqueNamesGenerator()

  const numberDictionary = uniqueNamesGenerator.NumberDictionary.generate({ min: 100, max: 1e10 })
  const username = uniqueNamesGenerator.uniqueNamesGenerator({
    dictionaries: [uniqueNamesGenerator.adjectives, uniqueNamesGenerator.names, numberDictionary],
    separator: '_',
    style: 'lowerCase',
  })

  const avatar = await getRandomAvatar()

  return {
    id: user.uid,
    username: username,
    name: user.displayName!,
    email: user.email!,
    createdAt: new Date().getTime(),
    avatarUrl: avatar,
    bio: null,
    websiteUrl: null,
    socialUsernames: {
      instagram: null,
      twitter: null,
      youtube: null,
    },
  }
}

export const isSessionUser = (user: IUserInfo | null, profileInfo: IUserInfo | null) => {
  return user?.email === profileInfo?.email
}
