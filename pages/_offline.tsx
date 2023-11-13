import React, { useState } from 'react'
import PageContainer from '../components/PageContainer'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import { prepareOfflinePageSeo } from '../utils/seo/pages/offline'
import CoreImage, { ImageSourceType } from '../components/core/CoreImage'
import { prepareImageUrl } from '../utils/image'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const OfflinePage: NextPage<IProps> = () => {
  const [loading, toggleLoading] = useState(false)

  return (
    <div>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .ys-ofln {
          display: flex;
          flex-direction: column;
          height: 100vh;
          color: #ffffff;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .ys-ofln-ttl {
          font-size: 24px;
          font-weight: 600;
          color: #1e1e1e;
          line-height: 30px;
          padding: 10px 0;
        }

        .ys-ofln-txt {
          font-size: 16px;
          font-weight: 400;
          color: #51505d;
          line-height: 20px;
          padding: 10px 40px;
        }

        .ys-img {
          margin-bottom: 20px;
          height: 150px;
          width: 170px;
        }

        button {
          outline: none;
          border: 0;
          padding: 12px 20px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 400;
          background-color: #ce2e35;
          width: 200px;
          margin: 20px 0;
          border-radius: 6px;
          cursor: pointer;
        }

        button:hover {
          background-color: rgba(206, 46, 53, 0.9);
        }
      `}</style>

      <PageContainer>
        <div className="ys-ofln">
          <div className="ys-img">
            <CoreImage url={prepareImageUrl('/images/offline.svg', ImageSourceType.ASSET)} alt={`Offline`} />
          </div>
          <div className="ys-ofln-ttl">{`You're Offline`}</div>
          <div className="ys-ofln-txt">No Internet connection found. Check your connection or try again.</div>
          <button
            onClick={() => {
              toggleLoading(true)
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            }}>
            {loading ? 'Reloading...' : 'Reload'}
          </button>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareOfflinePageSeo(),
      layoutData: {
        header: {},
        footer: {
          show: true,
        },
      },
      analytics: null,
      ads: {
        stickyBanner: {
          show: {
            desktop: false,
            mobile: false,
          },
        },
      },
    },
  }
}

export default OfflinePage
