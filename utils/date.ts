import dayjs from 'dayjs'
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export const getRelativeTime = (time: string) => {
  // @ts-ignore
  return dayjs(time).fromNow()
}
