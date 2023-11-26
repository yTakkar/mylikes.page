import React, { useEffect, useState } from 'react'
import { isCookieBannerShown, setCookieBannerShown } from '../utils/cookieBanner'
import classNames from 'classnames'
import { CheckIcon } from '@heroicons/react/outline'

interface ICookieBannerProps {}

const CookieBanner: React.FC<ICookieBannerProps> = () => {
  const [show, toggle] = useState(false)

  useEffect(() => {
    const bannerShown = isCookieBannerShown()
    if (!bannerShown) {
      toggle(true)
    }
  }, [])

  if (!show) {
    return null
  }

  // useEffect(() => {
  //   const bannerShown = isCookieBannerShown()
  //   if (!bannerShown) {
  //     setTimeout(() => {
  //       customToast('We use cookies to enhance the site experience and serve you well.', {
  //         duration: 5 * 1000,
  //         icon: <ShieldCheckIcon className="w-5 min-w-5 inline-block" />,
  //         position: 'top-center',
  //       })
  //       setCookieBannerShown(true)
  //     }, 5 * 1000)
  //   }
  // }, [])

  return (
    <div className="fixed bottom-0 left-0 md:left-0 right-0 bg-tautara text-white w-full shadow-md md:shadow-headerUserAddress p-4 flex justify-center">
      <span>
        We use cookies to enhance the site experience and serve you well.
        <span
          className={classNames('bg-brand-primary font-semibold text-sm cursor-pointer py-1 px-2 rounded ml-2')}
          onClick={() => {
            setCookieBannerShown(true)
            toggle(false)
          }}>
          Okay <CheckIcon className="w-4 h-4 inline-block" />
        </span>
      </span>
      {/* <div className="text-right mt-3 md:mt-0">
        <CoreButton
          label="Learn More"
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.OUTLINE_SECONDARY}
          onClick={() => {
            toggle(false)
          }}
          url={getPrivacyPageUrl()}
          className="mr-1"
        />
        <CoreButton
          label="Okay"
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.SOLID_PRIMARY}
          onClick={() => {
            setCookieBannerShown(true)
            toggle(false)
          }}
        />
      </div> */}
    </div>
  )
}

export default CookieBanner
