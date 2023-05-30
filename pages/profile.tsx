import React from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import { prepareHomePageSeo } from '../utils/seo/pages/home'
import PageContainer from '../components/PageContainer'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Home: NextPage<IProps> = () => {
  return (
    <PageContainer>
      <div>Profile</div>
    </PageContainer>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {},
      seo: prepareHomePageSeo(),
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

export default Home
