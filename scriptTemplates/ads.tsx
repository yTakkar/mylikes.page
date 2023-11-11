import React from 'react'
import appConfig from '../config/appConfig'

const MoneTag = () => {
  if (!appConfig.integrations.moneTagAds.enabled) {
    return null
  }

  return (
    <>
      <meta name="monetag" content={appConfig.integrations.moneTagAds.siteId} />
    </>
  )
}

const AdScripts: React.FC = () => {
  return (
    <>
      <MoneTag />
    </>
  )
}

export default AdScripts
