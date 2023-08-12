const withPlugins = require('next-compose-plugins')
const { getAbsPath } = require('./scripts/fileSystem')

const appEnv = process.env.ENV

if (!appEnv) {
  console.error('ENV env variable is not set', appEnv)
  process.exit(1)
}

const { parsed: parsedEnvs } = require('dotenv').config({
  path: getAbsPath(`env/${appEnv}.env`),
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZE === 'true',
})

console.log('process.env', process.env)
console.log('parsedEnvs', parsedEnvs)

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
}

module.exports = withPlugins([withBundleAnalyzer], nextConfig)
