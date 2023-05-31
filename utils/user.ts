import { User } from 'firebase/auth'
import { IUserInfo } from '../interface/applicationContext'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import appConfig from '../config/appConfig'
import { getRandomAvatar } from './avatars'

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
  const username = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '_',
  })

  return {
    id: user.uid,
    username: username,
    name: user.displayName!,
    email: user.email!,
    createdAt: new Date(),
    avatarUrl: await getRandomAvatar(),
    bio: null,
    websiteUrl: null,
    socialUsernames: {
      instagram: null,
      twitter: null,
    },
  }
}
