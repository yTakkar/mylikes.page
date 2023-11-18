import React, { useContext } from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import PageContainer from '../components/PageContainer'
import { prepareNotFoundPageSeo } from '../utils/seo/pages/error'
import NotFound from '../components/NotFound'
import ShelfLists from '../components/list/ShelfLists'
import ApplicationContext from '../components/ApplicationContext'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const NotFoundPage: NextPage<IProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const {
    ads: { featuredListsShelf },
  } = applicationContext

  return (
    <div>
      <PageContainer>
        <NotFound />

        {featuredListsShelf && (
          <div className="mt-10 px-3">
            <ShelfLists shelf={featuredListsShelf} source="404" />
          </div>
        )}
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareNotFoundPageSeo(),
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
            desktop: true,
            mobile: true,
          },
        },
      },
    },
  }
}

export default NotFoundPage
