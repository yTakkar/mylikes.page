import React, { useContext } from 'react'
import { prepareImageUrl } from '../utils/image'
import { getHomePageUrl } from '../utils/routes'
import CoreButton, { CoreButtonSize, CoreButtonType } from './core/CoreButton'
import CoreImage, { ImageSourceType } from './core/CoreImage'
import ApplicationContext from './ApplicationContext'

interface INotFoundProps {}

const NotFound: React.FC<INotFoundProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isMobile },
  } = applicationContext

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <CoreImage
        url={prepareImageUrl('/images/empty/empty-glass.svg', ImageSourceType.ASSET)}
        alt="Page not found"
        useTransparentPlaceholder
        className="w-52 min-h-52 lg:w-60"
      />
      <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto">{`We couldn't find the page you were looking for.`}</div>
      <div className="text-center mt-2 lg:mt-3">
        <CoreButton
          label="Go to Home"
          size={isMobile ? CoreButtonSize.MEDIUM : CoreButtonSize.LARGE}
          type={CoreButtonType.OUTLINE_SECONDARY}
          url={getHomePageUrl()}
        />
      </div>
    </div>
  )
}

export default NotFound
