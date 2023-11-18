import React, { useContext, useEffect, useState } from 'react'
import ApplicationContext from '../ApplicationContext'
import appConfig from '../../config/appConfig'

interface IStickBannerAdProps {
  showOnMobile: boolean
  showOnDesktop: boolean
}

const StickyBannerAd: React.FC<IStickBannerAdProps> = props => {
  const { showOnDesktop, showOnMobile } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isMobile },
  } = applicationContext

  const [key, setKey] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(new Date().getTime())
    }, appConfig.ads.refreshAdsIntervalInSec * 1000)
    return () => clearInterval(interval)
  }, [])

  const renderAd = () => {
    return (
      <div
        className="fixed bottom-0 w-full left-0 right-0 h-[50px] bg-gray-200 flex justify-center items-center"
        suppressHydrationWarning>
        {appConfig.isDev ? null : (
          <iframe
            key={key}
            src={`//${appConfig.ads.adsTerra.domain}/watchnew?key=${appConfig.ads.adsTerra.stickyBannerKey}`}
            width={320}
            height={50}
            frameBorder={0}
            scrolling="no"></iframe>
        )}
      </div>
    )
  }

  if (showOnMobile && isMobile) {
    return renderAd()
  }

  if (showOnDesktop && !isMobile) {
    return renderAd()
  }

  return null
}

export default StickyBannerAd
