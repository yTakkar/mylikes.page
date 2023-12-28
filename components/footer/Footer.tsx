import React from 'react'
import appConfig from '../../config/appConfig'
import CoreLink from '../core/CoreLink'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import EscapeHTML from '../EscapeHTML'
import { SOCIAL_ICONS_SRC_MAP } from '../../constants/constants'
import { prepareImageUrl } from '../../utils/image'

interface IFooterProps {}

const Footer: React.FC<IFooterProps> = () => {
  return (
    <footer>
      <div className="bg-white h-8 md:h-10"></div>

      <div className="bg-aliceBlue px-4 py-6 lg:py-8 shadow-inner">
        <div className="container mx-auto">
          <div className="lg:flex justify-between items-start">
            <div className="flex flex-col">
              <div>
                <div className="font-bold mb-2">{appConfig.global.app.name}</div>
                <div className="flex flex-col lg:flex-row text-typo-paragraphLight text-sm font-medium">
                  {appConfig.footer.links.map((link, index) => (
                    <CoreLink key={index} url={link.url!} className="py-1 lg:py-0 lg:mr-2 hover:underline">
                      {link.label}
                    </CoreLink>
                  ))}
                </div>
              </div>

              {appConfig.features.enableAppPromotions ? (
                <div className="mt-4 lg:mt-6">
                  <div className="flex">
                    <CoreLink url={appConfig.app.android.storeUrl}>
                      <CoreImage
                        url={prepareImageUrl('/images/google-play-store.png', ImageSourceType.ASSET)}
                        alt={`${appConfig.global.app.name} Android app`}
                        className="h-11 mr-1"
                      />
                    </CoreLink>
                    <CoreLink url={appConfig.app.iOS.storeUrl}>
                      <CoreImage
                        url={prepareImageUrl('/images/apple-app-store.png', ImageSourceType.ASSET)}
                        alt={`${appConfig.global.app.name} iOS app`}
                        className="h-11"
                      />
                    </CoreLink>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6 lg:mt-0">
              <div className="flex justify-center lg:justify-normal">
                {appConfig.company.socialLinks.map((socialLink, index) => {
                  const socialIconSrc = SOCIAL_ICONS_SRC_MAP[socialLink.type] || SOCIAL_ICONS_SRC_MAP.GLOBE

                  return (
                    <CoreLink
                      key={index}
                      url={socialLink.url}
                      isExternal={socialLink.isExternal}
                      className="w-6 mr-5 transform transition-transform hover:scale-110"
                      title={`${socialLink.name}`}>
                      <CoreImage url={socialIconSrc} alt={socialLink.name} useTransparentPlaceholder />
                    </CoreLink>
                  )
                })}
              </div>
            </div>
          </div>

          {/* <div className="mt-10 lg:mt-8 text-typo-paragraphLight text-sm">
            This website is a participant in the Amazon Services LLC Associates Program, an affiliate advertising
            program designed to provide a means for sites to earn advertising fees by advertising and linking to
            Amazon.com.
          </div> */}

          {appConfig.footer.copyrightText ? (
            <div className="mt-10 lg:mt-8 text-typo-paragraphLight text-sm">
              <EscapeHTML html={appConfig.footer.copyrightText} element="span" />
            </div>
          ) : null}
        </div>
      </div>

      {appConfig.features.enableStickyBannerAd && <div className="bg-aliceBlue h-[50px]"></div>}
    </footer>
  )
}

export default Footer
