import React from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import PageContainer from '../components/PageContainer'
import Error from '../components/error/Error'
import { prepareErrorPageSeo } from '../utils/seo/pages/error'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const ErrorPage: NextPage<IProps> = () => {
  return (
    <div>
      <PageContainer>
        <Error />
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  // TODO: - get data, revalidate
  return {
    props: {
      pageData: {},
      seo: prepareErrorPageSeo(),
      layoutData: {
        header: {},
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
  }
}

export default ErrorPage
