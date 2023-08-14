export const dynamicNprogress = () => import(/* webpackChunkName: "Nprogress" */ 'nprogress')

export const dynamicSentry = () => import(/* webpackChunkName: "sentry" */ '@sentry/nextjs')

export const dynamicToast = () =>
  import(/* webpackChunkName: "react-hot-toast" */ 'react-hot-toast').then(mod => mod.toast)

export const dynamicUniqueNamesGenerator = () =>
  import(/* webpackChunkName: "unique-names-generator" */ 'unique-names-generator').then(mod => ({
    NumberDictionary: mod.NumberDictionary,
    adjectives: mod.adjectives,
    names: mod.names,
    uniqueNamesGenerator: mod.uniqueNamesGenerator,
  }))
