/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext } from 'react'
import { IGlobalLayoutProps } from '../_app'
import PageContainer from '../../components/PageContainer'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { getUserByUsername, listUsers } from '../../firebase/store/users'
import { get404PageUrl, getProfileEditPageUrl } from '../../utils/routes'
import { IUserInfo } from '../../interface/user'
import { INITIAL_PAGE_BUILD_COUNT, PAGE_REVALIDATE_TIME, SOCIAL_ICONS_SRC_MAP } from '../../constants/constants'
import { prepareProfilePageSeo } from '../../utils/seo/pages/profile'
import CoreImage from '../../components/core/CoreImage'
import appConfig from '../../config/appConfig'
import ApplicationContext from '../../components/ApplicationContext'
import { useRouter } from 'next/router'
import PageLoader from '../../components/loader/PageLoader'
import ListInfos from '../../components/list/ListInfos'
import { listListsByUser } from '../../firebase/store/list'
import { IListDetail } from '../../interface/list'
import classNames from 'classnames'
import { isAdminUser, withHttp } from '../../utils/common'
import useScrollToTop from '../../hooks/useScrollToTop'
import CoreLink from '../../components/core/CoreLink'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    profileInfo: IUserInfo
    lists: IListDetail[]
  }
}

const ProfilePage: NextPage<IProps> = (props: IProps) => {
  const router = useRouter()

  if (router.isFallback || !props.pageData) {
    return <PageLoader />
  }

  const {
    pageData: { profileInfo, lists },
  } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  useScrollToTop()

  const DEFAULT_BIO = 'This bio is super empty at the moment.'

  const socialLinks = [
    {
      url: profileInfo.websiteUrl ? withHttp(profileInfo.websiteUrl) : null,
      name: 'Website',
      iconSrc: SOCIAL_ICONS_SRC_MAP.GLOBE,
      show: !!profileInfo.websiteUrl,
    },
    {
      url: `https://twitter.com/${profileInfo.socialUsernames.twitter}`,
      name: 'Twitter',
      iconSrc: SOCIAL_ICONS_SRC_MAP.TWITTER,
      show: !!profileInfo.socialUsernames.twitter,
    },
    {
      url: `https://instagram.com/${profileInfo.socialUsernames.instagram}`,
      name: 'Instagram',
      iconSrc: SOCIAL_ICONS_SRC_MAP.INSTAGRAM,
      show: !!profileInfo.socialUsernames.instagram,
    },
    {
      url: `https://www.youtube.com/@${profileInfo.socialUsernames.instagram}`,
      name: 'YouTube',
      iconSrc: SOCIAL_ICONS_SRC_MAP.YOUTUBE,
      show: !!profileInfo.socialUsernames.youtube,
    },
  ]

  const socialLinksToShow = socialLinks.filter(socialLink => socialLink.show)

  const currentUserProfile = profileInfo.username === user?.username

  return (
    <PageContainer>
      <div className="p-4 py-6">
        <div className="bg-whit flex flex-col justify-center items-center lg:flex-row lg:justify-normal">
          <div
            onClick={() => {
              if (currentUserProfile) {
                router.push(getProfileEditPageUrl())
              }
            }}
            title="Edit">
            <CoreImage
              url={profileInfo.avatarUrl}
              alt={`${profileInfo.name}'s profile on ${appConfig.global.app.name}`}
              className={classNames('w-40 h-40 rounded-full', {
                'cursor-pointer': currentUserProfile,
              })}
            />
          </div>

          <div className="text-center lg:text-left lg:ml-8">
            <div className="flex flex-col items-center mt-4 lg:flex-row lg:mt-0">
              <div className="font-domaine-bold font-bold text-3xl tracking-wide lg:text-4xl">{profileInfo.name}</div>
              {profileInfo._isAdmin && !currentUserProfile ? (
                <span className="ml-2 bg-gallery text-xxs px-1 py-[2px] rounded-sm">Admin</span>
              ) : null}
              {currentUserProfile && (
                <div
                  className="bg-gallery text-xxs px-1 py-[2px] rounded-sm mt-3 lg:ml-2 cursor-pointer"
                  onClick={() => {
                    router.push(getProfileEditPageUrl())
                  }}>
                  Edit profile
                </div>
              )}
            </div>
            <div className="mt-4 lg:mt-1">@{profileInfo.username}</div>
            <div className="text-gray-500 mt-4">{profileInfo.bio || DEFAULT_BIO}</div>

            {socialLinksToShow.length > 0 && (
              <div className="flex justify-center items-center mt-4 lg:items-start lg:justify-normal">
                {socialLinksToShow.map(socialLink => {
                  return (
                    <CoreLink
                      key={socialLink.name}
                      url={socialLink.url}
                      isExternal
                      className="w-5 mr-3 transform transition-transform hover:scale-110"
                      title={`${socialLink.name}`}>
                      <CoreImage url={socialLink.iconSrc} alt={socialLink.name} useTransparentPlaceholder />
                    </CoreLink>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <ListInfos lists={lists} profileUser={profileInfo} />
        </div>
      </div>
    </PageContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await listUsers({
    limit: INITIAL_PAGE_BUILD_COUNT.PROFILE,
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

  if (profileInfo) {
    if (isAdminUser(profileInfo.email)) {
      profileInfo!._isAdmin = true
    }
  }

  const listsByUser = await listListsByUser(profileInfo)

  return {
    props: {
      pageData: {
        profileInfo,
        lists: listsByUser,
      },
      seo: prepareProfilePageSeo(profileInfo, listsByUser),
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
      ads: {
        stickyBanner: {
          show: {
            desktop: true,
            mobile: true,
          },
        },
      },
    },
    revalidate: PAGE_REVALIDATE_TIME.PROFILE,
  }
}

export default ProfilePage
