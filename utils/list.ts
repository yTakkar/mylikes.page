import { nanoid } from 'nanoid'
// import slugify from 'slugify'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generateListId = (_name: string): string => {
  // const slug = slugify(name, {
  //   replacement: '-',
  //   lower: true,
  // })
  // const uid = nanoid(10)
  return nanoid()
}
