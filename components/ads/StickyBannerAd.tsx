import React, { useContext } from 'react'
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

  const renderAd = () => {
    return (
      <div
        className="fixed bottom-0 w-full h-[50px] bg-gray-200 flex justify-center items-center"
        suppressHydrationWarning>
        {appConfig.isDev ? null : (
          <iframe
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
