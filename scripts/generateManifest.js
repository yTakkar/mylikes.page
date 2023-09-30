const appEnv = process.env.ENV

require('dotenv').config({
  path: getAbsPath(`env/${appEnv}.env`),
})

import fs from 'fs'
import appConfig from '../config/appConfig.ts'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config'
import manifestIcons from '../public/json/manifest-icons.json'
// import manifestScreenshots from '../public/json/manifest-screenshots.json'
import { getAbsPath } from './fileSystem.js'

const prepareImageUrl = urlPath => {
  if (process.env.ENV_ASSETS_BASE_URL) {
    return `${process.env.ENV_ASSETS_BASE_URL}${urlPath || ''}`
  }
  return urlPath
}

// Prepend asset base url if available
const updatedManifestIcons = manifestIcons.icons.map(icon => ({
  src: prepareImageUrl(icon.src),
  sizes: icon.sizes,
}))

// Prepend asset base url if available
// const updatedManifestScreenshots = manifestScreenshots.screenshots.map(screenshot => ({
//   src: prepareImageUrl(screenshot.src),
//   type: screenshot.type,
//   sizes: screenshot.sizes,
// }))

const resolvedTailwindConfig = resolveConfig(tailwindConfig)
const theme = resolvedTailwindConfig.theme

const manifestJSON = {
  id: appConfig.global.app.name,
  name: appConfig.global.app.name,
  short_name: appConfig.global.app.shortName,
  description: appConfig.global.app.title,
  theme_color: theme.colors.brand.primary,
  background_color: theme.colors.white,
  start_url: appConfig.pwa.startUrl,
  orientation: 'portrait',
  display: 'standalone',
  icons: updatedManifestIcons.map(icon => {
    return {
      ...icon,
      purpose: appConfig.pwa.icons.maskable ? 'maskable' : 'any',
    }
  }),
  // screenshots: updatedManifestScreenshots,
  // shortcuts: appConfig.pwa.shortcuts.map(shortcut => {
  //   return {
  //     ...shortcut,
  //     icons: [
  //       {
  //         src: prepareImageUrl(`/images/generated-logos/android-icon-192x192.png`),
  //         sizes: '192x192',
  //       },
  //     ],
  //   }
  // }),
  // prefer_related_applications: appConfig.pwa.preferNativeAppOverPWA,
  related_applications: [],
}

if (appConfig.app.android.storeUrl) {
  manifestJSON.related_applications.push({
    platform: 'play',
    url: appConfig.app.android.storeUrl,
    id: appConfig.app.android.id,
  })
}

if (appConfig.app.iOS.storeUrl) {
  manifestJSON.related_applications.push({
    platform: 'itunes',
    url: appConfig.app.iOS.storeUrl,
  })
}

fs.writeFileSync(getAbsPath('public/json/manifest.json'), JSON.stringify(manifestJSON, null, 2))
