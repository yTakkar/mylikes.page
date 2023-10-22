export function shuffle<Type = any>(array: Type[]): Type[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

export const getArrayChunks = <T>(array: T[], size: number) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (value, index) =>
    array.slice(index * size, index * size + size)
  )
}

export const getRandomArrayItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const isArray = (value: any): boolean => {
  return value !== null && Array.isArray(value)
}

export const filterArrayItemsValid = <T>(array: T[]): T[] => {
  return array.filter(Boolean)
}

export type IArrayPositionItemsConfig = Record<number, any | any[]>

export const insertArrayPositionItems = (items: any[], positions: IArrayPositionItemsConfig): any[] => {
  if (!items.length) {
    const result: any[] = []
    const { 0: zeroItems } = positions
    const _zeroItems = filterArrayItemsValid(isArray(zeroItems) ? (zeroItems as any[]) : [zeroItems as any])

    _zeroItems.forEach(item => {
      result.push(item)
    })

    return result
  }

  const result = items.reduce<any[]>((acc, currentValue, currentIdx) => {
    const indexItems = positions[currentIdx]
    const _indexItems = filterArrayItemsValid(isArray(indexItems) ? (indexItems as any[]) : [indexItems as any])

    _indexItems.forEach(item => {
      acc.push(item)
    })

    acc.push(currentValue)
    return acc
  }, [])

  const lastItems = positions[-1]
  const _lastItems = filterArrayItemsValid(isArray(lastItems) ? (lastItems as any[]) : [lastItems as any])

  _lastItems.forEach(item => {
    result.push(item)
  })

  return result
}
