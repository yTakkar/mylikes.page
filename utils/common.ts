import { NextRouter } from 'next/router'
import { getHomePageUrl } from './routes'
import { VibratePatternType } from '../constants/constants'
import { Timestamp } from 'firebase/firestore'
import numeral from 'numeral'

// Ref: last comment on this page: https://bugs.webkit.org/show_bug.cgi?id=153852#c43
export const disablePageScrolling = () => {
  const body = document.body
  document.body.style.overflow = 'hidden'
  const offsetY = window.pageYOffset
  body.style.top = `${-offsetY}px`
  body.style.width = '100vw'
  body.classList.add('js-modal-lock-position')
}

export const enablePageScrolling = () => {
  const body = document.body
  body.style.overflow = 'auto'
  const top = Number(body.style.top.replace('px', '')) || 0
  const offsetY = Math.abs(top)
  body.classList.remove('js-modal-lock-position')
  body.style.removeProperty('top')
  body.style.removeProperty('width')
  window.scrollTo(0, offsetY || 0)
}

export const addBlur = () => {
  const pageWrapper = document.querySelector('.page-main')
  const topNav = document.querySelector('.top-nav')

  const elements = [pageWrapper, topNav].filter(Boolean)

  elements.forEach(element => {
    if (element) {
      element.classList.remove('no-blur')
      element.classList.add('blur')
    }
  })
}

export const removeBlur = () => {
  const pageWrapper = document.querySelector('.page-main')
  const topNav = document.querySelector('.top-nav')

  const elements = [pageWrapper, topNav].filter(Boolean)

  elements.forEach(element => {
    if (element) {
      element.classList.remove('blur')
      element.classList.add('no-blur')
    }
  })
}

export const matchMinMaxMediaQuery = (min: number, max: number) => {
  return window.matchMedia(`(min-width: ${min}px) and (max-width: ${max}px)`).matches
}

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

export const isEmptyObject = (object: object) => Object.keys(object).length === 0

export const prependZero = (unit: number | string) => {
  const _unit = typeof unit === 'string' ? parseInt(unit) : unit
  return _unit < 10 ? `0${_unit}` : _unit
}

export const formatHeaderCount = (count: number): string | null => {
  if (!count) return null
  if (count > 9) return '9+'
  return `${prependZero(count)}`
}

export const uniqListOfObjects = (keyGetter: (item: any) => any) => (list: any[]) => {
  return list.filter(function (item, pos, array) {
    return (
      array
        .map(function (mapItem) {
          return keyGetter(mapItem)
        })
        .indexOf(keyGetter(item)) === pos
    )
  })
}

export const capitalize = (s: string, restLowerCase?: boolean) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + (restLowerCase ? s.slice(1).toLowerCase() : s.slice(1))
}

export const toPascalCase = (string: string) => {
  return string
    .split(' ')
    .map(s => capitalize(s, true))
    .join(' ')
}

export const pluralize = (word: string, count: number) => {
  if (count === 1) return `${count} ${word}`
  return `${numeral(count).format()} ${word}s`
}

export const getUrlParams = (uri: string) => {
  const vars: any = {}
  // @ts-ignore
  uri.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_m, key, value) => {
    vars[key] = value
    return null
  })
  return vars
}

export const updateUrlParam = (uri: string, key: string, value: string | null) => {
  // remove the hash part before operating on the uri
  const i = uri.indexOf('#')
  const hash = i === -1 ? '' : uri.substr(i)
  uri = i === -1 ? uri : uri.substr(0, i)

  const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i')
  const separator = uri.indexOf('?') !== -1 ? '&' : '?'

  if (value === null) {
    // remove key-value pair if value is specifically null
    uri = uri.replace(new RegExp(`([?&]?)${key}=[^&]*`, 'i'), '')
    if (uri.slice(-1) === '?') {
      uri = uri.slice(0, -1)
    }
    // replace first occurrence of & by ? if no ? is present
    if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?')
  } else if (uri.match(re)) {
    uri = uri.replace(re, `$1${key}=${value}$2`)
  } else {
    uri = `${uri + separator + key}=${value}`
  }
  return uri + hash
}

export const routerPageBack = (router: NextRouter, backUrl?: string) => {
  if (window.history.length > 1) {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  } else {
    router.push(getHomePageUrl())
  }
}

export const vibrate = (pattern: VibratePatternType = VibratePatternType.DEFAULT) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

export const timestampToMillis = (timestamp: Timestamp) => (timestamp as unknown as Timestamp).toMillis()

export const copyToClipboard = (secretInfo: string) => {
  const body = document.getElementsByTagName('body')[0]
  const tempInput = document.createElement('INPUT')
  body.appendChild(tempInput)
  tempInput.setAttribute('value', secretInfo)
  // @ts-ignore
  tempInput.select()
  document.execCommand('copy')
  body.removeChild(tempInput)
}

export const isAdminUser = (email: string) => {
  return email?.endsWith('@mylikes.page') || email === 'mylikescontact@gmail.com'
}

export const withHttp = (url: string) => (!/^https?:\/\//i.test(url) ? `http://${url}` : url)
