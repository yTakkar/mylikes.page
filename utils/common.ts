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
  if (count > 1) return `${word}s`
  return word
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
