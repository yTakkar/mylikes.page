import React from 'react'
import { IGlobalLayoutProps } from '../_app'
import { IShelfDetail } from '../../interface/shelf'
import { useRouter } from 'next/router'
import PageLoader from '../../components/loader/PageLoader'
import PageContainer from '../../components/PageContainer'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { getShelfById, listShelfInfos } from '../../firebase/store/shelf'
import { get404PageUrl } from '../../utils/routes'
import { prepareShelfPageSeo } from '../../utils/seo/pages/shelf'
import { PAGE_REVALIDATE_TIME } from '../../constants/constants'
import { DesktopView, MobileView } from '../../components/ResponsiveViews'
import Snackbar from '../../components/header/Snackbar'
import BackTitle from '../../components/BackTitle'
import ListInfo from '../../components/list/ListInfo'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import useScrollToTop from '../../hooks/useScrollToTop'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    shelf: IShelfDetail
  }
}

const Shelf: NextPage<IProps> = (props: IProps) => {
  const router = useRouter()

  if (router.isFallback || !props.pageData) {
    return <PageLoader />
  }

  useScrollToTop()

  const {
    pageData: { shelf },
  } = props

  const title = `${shelf.name} (${shelf.listInfos.length})`

  return (
    <div>
      <MobileView>
        <Snackbar title={title} />
      </MobileView>

      <PageContainer>
        <div className="px-3">
          <DesktopView>
            <BackTitle title={title} />
          </DesktopView>

          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6 mt-4 lg:mt-0">
              {shelf.listInfos.map(list => {
                return (
                  <ListInfo
                    key={list.id}
                    list={list}
                    onClick={() => {
                      appAnalytics.sendEvent({
                        action: AnalyticsEventType.SHELF_LIST_VISIT,
                        extra: {
                          shelfId: shelf.id,
                          listId: list.id,
                        },
                      })
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const shelves = await listShelfInfos()

  const paths: any = shelves.map(shelf => ({
    params: {
      shelfId: shelf.id,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any

  const shelfDetail = await getShelfById(params.shelfId, {})

  if (!shelfDetail) {
    return {
      redirect: {
        destination: get404PageUrl(),
        permanent: false,
      },
    }
  }

  return {
    props: {
      pageData: {
        shelf: shelfDetail,
      },
      seo: prepareShelfPageSeo(shelfDetail),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: true,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
      ads: {
        stickyBanner: {
          show: {
            desktop: true,
            mobile: true,
          },
        },
      },
    },
    revalidate: PAGE_REVALIDATE_TIME.SHELF,
  }
}

export default Shelf
