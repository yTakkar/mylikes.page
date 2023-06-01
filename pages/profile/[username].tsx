import React from 'react'
import { IGlobalLayoutProps } from '../_app'
import PageContainer from '../../components/PageContainer'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { getUserByUsername, listUsers } from '../../firebase/store/users'
import { get404PageUrl } from '../../utils/routes'
import { IUserInfo } from '../../interface/applicationContext'
import { PAGE_REVALIDATE_TIME } from '../../constants/constants'
import { prepareProfilePageSeo } from '../../utils/seo/pages/profile'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    profileInfo: IUserInfo
  }
}

const Home: NextPage<IProps> = () => {
  return (
    <PageContainer>
      <div>Profile</div>
    </PageContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await listUsers({
    limit: 100,
  })

  const paths: any = users.map(user => ({
    params: {
      username: user.username,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async context => {
  const params = context.params as any

  const profileInfo = await getUserByUsername(params.username)

  if (!profileInfo) {
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
        profileInfo,
      },
      seo: prepareProfilePageSeo(profileInfo),
      layoutData: {
        header: {
          hideTopNav: {
            desktop: false,
            mobile: false,
          },
        },
        footer: {
          show: true,
        },
      },
      analytics: null,
    },
    revalidate: PAGE_REVALIDATE_TIME.PROFILE,
  }
}

export default Home
