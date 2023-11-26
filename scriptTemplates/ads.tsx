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
      <script
        src="https://richinfo.co/richpartners/pops/js/richads-pu-ob.js"
        data-pubid="903647"
        data-siteid="338512"
        async
        data-cfasync="false"
      />
    </>
  )
}

export default AdScripts
