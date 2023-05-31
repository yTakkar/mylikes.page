import appConfig from '../config/appConfig'

export const getAvatarsList = async (): Promise<string[]> => {
  const response = await fetch(`${appConfig.global.avatarsBaseUrl}/avatars.json`)
  return await response.json()
}

export const getRandomAvatar = async (): Promise<string> => {
  const avatarsList = await getAvatarsList()
  return avatarsList[~~(Math.random() * avatarsList.length)]
}
