import React from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import PageContainer from '../components/PageContainer'
import { prepareNotFoundPageSeo } from '../utils/seo/pages/error'
import NotFound from '../components/NotFound'
import { getShelfById } from '../firebase/store/shelf'
import { IShelfDetail } from '../interface/shelf'
import ShelfLists from '../components/list/ShelfLists'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    shelf: IShelfDetail | null
  }
}

const NotFoundPage: NextPage<IProps> = props => {
  const {
    pageData: { shelf },
  } = props

  return (
    <div>
      <PageContainer>
        <NotFound />

        {shelf && (
          <div className="mt-10 px-3">
            <ShelfLists shelf={shelf} source="404" />
          </div>
        )}
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  const shelf = await getShelfById('featured-lists', {
    limit: 4,
  })

  return {
    props: {
      pageData: {
        shelf,
      },
      seo: prepareNotFoundPageSeo(),
      layoutData: {
        header: {},
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
    revalidate: PAGE_REVALIDATE_TIME[404],
  }
}

export default NotFoundPage
