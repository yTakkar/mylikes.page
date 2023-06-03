import React from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import PageContainer from '../components/PageContainer'
import { prepareNotFoundPageSeo } from '../utils/seo/pages/error'
import NotFound from '../components/NotFound'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const NotFoundPage: NextPage<IProps> = () => {
  return (
    <div>
      <PageContainer>
        <NotFound />

        {/* <div className="mt-8">
          {sections.map((section, index) => (
            <Section key={index} section={section} />
          ))}
        </div> */}
      </PageContainer>
    </div>
  )
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  // TODO: - get data, revalidate
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
    },
  }
}

export default NotFoundPage
