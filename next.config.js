const { getAbsPath } = require('./scripts/fileSystem')
const nextPWA = require('next-pwa')
const nextBundlerAnalyzer = require('@next/bundle-analyzer')

const appEnv = process.env.ENV

if (!appEnv) {
  console.error('ENV env variable is not set', appEnv)
  process.exit(1)
}

const { parsed: parsedEnvs } = require('dotenv').config({
  path: getAbsPath(`env/${appEnv}.env`),
})

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ...parsedEnvs,
    ENV: appEnv,
  },
  trailingSlash: false,
  basePath: '',
  poweredByHeader: false,
  optimizeFonts: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  assetPrefix: process.env.ENV_ASSETS_BASE_URL,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [...securityHeaders],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/ads.txt',
        destination: '/txt/ads.txt',
      },
      {
        source: '/sw.js',
        destination: '/js/sw.js',
      },
      {
        source: '/sw.js.map',
        destination: '/js/sw.js.map',
      },
    ]
  },
}

module.exports = () => {
  const plugins = [
    nextPWA({
      dest: 'public/js',
      sw: 'sw.js',
      scope: '/',
      disable: appEnv.startsWith('local'),
      register: true,
      swSrc: './pwa/service-worker.js',
    }),
    nextBundlerAnalyzer({
      enabled: process.env.BUNDLE_ANALYZE === 'true',
    }),
  ]
  return plugins.reduce((acc, next) => next(acc), nextConfig)
}
