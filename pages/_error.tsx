import React from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import PageContainer from '../components/PageContainer'
import Error from '../components/error/Error'
import { prepareErrorPageSeo } from '../utils/seo/pages/error'
import { IShelfDetail } from '../interface/shelf'
import { getShelfById } from '../firebase/store/shelf'
import { PAGE_REVALIDATE_TIME } from '../constants/constants'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    shelf: IShelfDetail
  }
}

const ErrorPage: NextPage<IProps> = props => {
  const {
    pageData: { shelf },
  } = props

  return (
    <div>
      <PageContainer>
        <Error shelf={shelf || null} />
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
      seo: prepareErrorPageSeo(),
      layoutData: {
        header: {},
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
    revalidate: PAGE_REVALIDATE_TIME.ERROR,
  }
}

export default ErrorPage
