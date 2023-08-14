const withPlugins = require('next-compose-plugins')
const { getAbsPath } = require('./scripts/fileSystem')
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin')

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
    ]
  },
  webpack: config => {
    config.devtool = 'source-map'
    config.plugins.push(
      sentryWebpackPlugin({
        org: process.env.ENV_INTEGRATION_SENTRY_ORG,
        project: process.env.ENV_INTEGRATION_SENTRY_PROJECT,
        authToken: process.env.ENV_INTEGRATION_SENTRY_AUTH_TOKEN,
        include: '.next',
        ignore: ['node_modules'],
        urlPrefix: '~/_next',
      })
    )
    return config
  },
}

module.exports = withPlugins([withBundleAnalyzer], nextConfig)
