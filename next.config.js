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

const isLocal = appEnv.includes('local')

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Reporting-Endpoints',
    value:
      'endpoint="https://o4505702857637888.ingest.sentry.io/api/4505702860914688/security/?sentry_key=d9a5a3ca87c60b11a9ad14a2d07043c6"',
  },
  {
    key: 'Content-Security-Policy',
    value: `upgrade-insecure-requests; object-src 'none'; frame-ancestors 'none'; form-action 'none'; font-src https://fonts.googleapis.com https://fonts.gstatic.com 'self' data:; script-src 'self' 'nonce-eXFBngjwfBsaKvk2tWSS' 'nonce--Jv3vXWEec5rT0Unhie_' blob: ${
      isLocal ? "'unsafe-eval'" : ''
    } www.googletagmanager.com ajax.googleapis.com https://apis.google.com https://va.vercel-scripts.com; base-uri 'self'; report-uri https://o4505702857637888.ingest.sentry.io/api/4505702860914688/security/?sentry_key=d9a5a3ca87c60b11a9ad14a2d07043c6; report-to endpoint;`,
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
        source: '/most-popular-recommendations',
        destination: '/custom-list/most-popular-recommendations',
      },
      {
        source: '/featured-lists',
        destination: '/shelf/featured-lists',
      },
    ]
  },
}

module.exports = () => {
  const plugins = [
    nextPWA({
      dest: 'public',
      disable: appEnv.startsWith('local'),
    }),
    nextBundlerAnalyzer({
      enabled: process.env.BUNDLE_ANALYZE === 'true',
    }),
  ]
  return plugins.reduce((acc, next) => next(acc), nextConfig)
}
