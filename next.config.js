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

/**
 * resource "aws_cloudfront_response_headers_policy" "security_headers_policy"{
  name = "headers-policy-${terraform.workspace}"
  custom_headers_config {
    items {
      header   = "Reporting-Endpoints"
      override = true
      value    = "endpoint=\"https://csp-report.browser-intake-datadoghq.com/api/v2/logs?dd-api-key=pub0d48c78fc2894bdc2c8c2b7a2d852d8f&dd-evp-origin=content-security-policy&ddsource=csp-report\""
    }
  }

  security_headers_config {
    content_security_policy {
      content_security_policy = "script-src 'self' blob: https://js.hs-scripts.com www.googletagmanager.com ajax.googleapis.com *.lr-in-prod.com *.cloudfront.net *.cloudflare.com *.whatfix.com https://whatfix.com; base-uri 'self'; report-uri https://csp-report.browser-intake-datadoghq.com/api/v2/logs?dd-api-key=pub0d48c78fc2894bdc2c8c2b7a2d852d8f&dd-evp-origin=content-security-policy&ddsource=csp-report; report-to endpoint; upgrade-insecure-requests; object-src 'none'; frame-ancestors 'none'; form-action 'none'; font-src 'self' data: https://fonts.gstatic.com;"
      override                = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    strict_transport_security {
      access_control_max_age_sec = "63072000"
      include_subdomains = true
      preload = true
      override = true
    }
    content_type_options {
      override = true
    }
  }
}
 */

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // {
  //   key: 'X-Content-Type-Options',
  //   value: 'nosniff',
  // },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
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
