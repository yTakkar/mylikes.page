import React from 'react'
import { IGlobalLayoutProps } from '../_app'
import PageContainer from '../../components/PageContainer'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { getUserByUsername, listUsers } from '../../firebase/store/users'
import { get404PageUrl } from '../../utils/routes'
import { IUserInfo } from '../../interface/applicationContext'
import { PAGE_REVALIDATE_TIME, SOCIAL_ICONS_SRC_MAP } from '../../constants/constants'
import { prepareProfilePageSeo } from '../../utils/seo/pages/profile'
import CoreImage from '../../components/core/CoreImage'
import appConfig from '../../config/appConfig'
import CoreLink from '../../components/core/CoreLink'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    profileInfo: IUserInfo
  }
}

const Home: NextPage<IProps> = (props: IProps) => {
  const {
    pageData: { profileInfo },
  } = props

  const DEFAULT_BIO = 'This bio is super empty at the moment.'

  const socialLinks = [
    {
      url: '',
      name: 'Website',
      iconSrc: SOCIAL_ICONS_SRC_MAP.GLOBE,
    },
    {
      url: '',
      name: 'Twitter',
      iconSrc: SOCIAL_ICONS_SRC_MAP.TWITTER,
    },
    {
      url: '',
      name: 'Instagram',
      iconSrc: SOCIAL_ICONS_SRC_MAP.INSTAGRAM,
    },
    {
      url: '',
      name: 'YouTube',
      iconSrc: SOCIAL_ICONS_SRC_MAP.YOUTUBE,
    },
  ]

  return (
    <PageContainer>
      <div className="bg-white p-4 py-6 flex flex-col justify-center items-center lg:flex-row lg:justify-normal">
        <div>
          <CoreImage
            url={profileInfo.avatarUrl}
            alt={`${profileInfo.name}'s profile on ${appConfig.global.app.name}`}
            className="w-40 h-40 rounded-full"
          />
        </div>

        <div className="text-center lg:text-left lg:ml-8">
          <div className="flex flex-col items-center mt-4 lg:flex-row lg:mt-0">
            <div className="font-domaine-bold font-bold text-3xl tracking-wide lg:text-4xl">{profileInfo.name}</div>
            <div className="bg-gallery text-xxs px-1 py-[2px] rounded-sm mt-3 lg:ml-2">Edit profile</div>
          </div>
          <div className="mt-4 lg:mt-1">@{profileInfo.username}</div>
          <div className="text-gray-500 mt-4">{profileInfo.bio || DEFAULT_BIO}</div>

          <div className="flex justify-center items-center mt-4 lg:items-start lg:justify-normal">
            {socialLinks.map(socialLink => (
              <CoreLink
                key={socialLink.name}
                url={socialLink.url}
                isExternal
                className="w-5 mr-3 transform transition-transform hover:scale-110"
                title={`${socialLink.name}`}>
                <CoreImage url={socialLink.iconSrc} alt={socialLink.name} useTransparentPlaceholder />
              </CoreLink>
            ))}
          </div>
        </div>
      </div>
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
