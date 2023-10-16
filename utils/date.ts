import dayjs from 'dayjs'
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export const getRelativeTime = (time: string | number) => {
  // @ts-ignore
  return dayjs(time).fromNow()
}
