export const dynamicSentry = () => import(/* webpackChunkName: "sentry" */ '@sentry/react').then(mod => mod.default)

export const dynamicSentryTracingIntegrations = () =>
  import(/* webpackChunkName: "sentry-tracing" */ '@sentry/tracing').then(mod => mod.Integrations)

export const dynamicToast = () =>
  import(/* webpackChunkName: "react-hot-toast" */ 'react-hot-toast').then(mod => mod.toast)
