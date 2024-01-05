import { Base64 } from 'js-base64'

export const encode = (value: string): string => {
  return Base64.encode(value)
}

export const decode = (value: string): string => {
  return Base64.decode(value)
}
