/* eslint-disable react/no-unescaped-entities */
import React, { useContext } from 'react'
import { IGlobalLayoutProps } from './_app'
import { GetStaticProps, NextPage } from 'next'
import { prepareHomePageSeo } from '../utils/seo/pages/home'
import PageContainer from '../components/PageContainer'
import CoreImage, { ImageSourceType } from '../components/core/CoreImage'
import { prepareImageUrl } from '../utils/image'
import { DesktopView } from '../components/ResponsiveViews'
import ShelfLists from '../components/list/ShelfLists'
import CoreLink from '../components/core/CoreLink'
import { getFeaturedListsPageUrl, getProfilePageUrl } from '../utils/routes'
import ApplicationContext from '../components/ApplicationContext'
import { useRouter } from 'next/router'

interface IProps extends IGlobalLayoutProps {
  pageData: {}
}

const Home: NextPage<IProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const {
    user,
    methods,
    ads: { featuredListsShelf },
  } = applicationContext

  const router = useRouter()

  const loggedIn = !!user

  const handleActionsClick = () => {
    if (loggedIn) {
      router.push(getProfilePageUrl(user.username))
      return
    }
    methods.login(userInfo => {
      router.push(getProfilePageUrl(userInfo.username))
    })
  }

  return (
    <PageContainer>
      <div className="">
        {/* banner */}
        <div className="px-4 lg:flex justify-between">
          <div className="lg:w-[500px] lg:mt-[90px]">
            <div className=" font-extrabold text-black text-[32px] leading-[48px] lg:text-[40px] lg:leading-[56px] tracking-[0]">
              <div className="lg:flex">
                <div>Share</div>
                <div className="text-amaranth lg:ml-[8px]">Recommendations, </div>
              </div>
              <div className="flex items-center">
                Discover{' '}
                <div className="mx-[8px] relative">
                  Passions,{' '}
                  <CoreImage
                    className="absolute bottom-0"
                    alt="Underline"
                    url={prepareImageUrl('/images/landing-page/underline.svg', ImageSourceType.ASSET)}
                    disableLazyload
                  />
                </div>
                and
              </div>
              <div className="flex items-center mt-1">
                <div className="mr-[8px]">Build</div>
                <div className="bg-dolly">Community</div>
              </div>
            </div>

            <div className="mt-4 lg:mt-6 font-bold text-black  text-lg lg:text-xl">
              Tell the world about the things you like. Your recommendations matter, and MyLikes is your{' '}
              <span className="border-b-mediumPurple border-b-4">forever-free</span> megaphone.
            </div>

            <div
              className="bg-mediumPurple rounded-[44px] border border-solid border-black font-medium text-white text-[14px] tracking-[0] leading-[14px] whitespace-nowrap text-center p-[14px] mt-5 lg:mt-6 md:inline-flex md:px-[30px] cursor-pointer"
              onClick={handleActionsClick}>
              Get Started
            </div>
          </div>

          <DesktopView>
            <div>
              <CoreImage
                className="min-w-[400px] w-[400px]"
                alt="Underline"
                url={prepareImageUrl('/images/landing-page/banner-1-showcase.png', ImageSourceType.ASSET)}
                useTransparentPlaceholder
              />
            </div>
          </DesktopView>
        </div>

        {/* divider */}
        <div className="mt-14 lg:-mt-4 relative">
          <CoreImage
            className="object-none"
            alt="Underline"
            url={prepareImageUrl('/images/landing-page/line-2.svg', ImageSourceType.ASSET)}
            disableLazyload
          />
          <CoreImage
            className="absolute w-16 h-16 left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] lg:left-[10%]"
            alt="Ellipse"
            url={prepareImageUrl('/images/landing-page/line-down.png', ImageSourceType.ASSET)}
            useTransparentPlaceholder
          />
        </div>

        {/* HTD */}
        <div className="mt-20 px-4">
          <div className="relative mb-[60px] lg:mb-[100px] md:w-[500px] md:mx-auto">
            <CoreImage
              className="absolute w-[51px] h-[71px] top-[53px] left-[210px] md:top-[30px] md:left-auto md:right-[-40px]"
              alt="A"
              url={prepareImageUrl('/images/landing-page/htd-down.svg', ImageSourceType.ASSET)}
              disableLazyload
            />
            <p className="font-extrabold text-black text-3xl lg:text-4xl text-center">How can MyLikes help you?</p>
          </div>

          {/* Step 1 */}
          <div className="lg:mt-10 lg:flex justify-between">
            <CoreImage
              className="md:w-[450px]"
              alt="Step 1"
              url={prepareImageUrl('/images/landing-page/step-1.png', ImageSourceType.ASSET)}
              useTransparentPlaceholder
            />
            <div className="lg:w-[500px]">
              <div className="relative font-extrabold text-black tracking-normal text-2xl lg:text-3xl whitespace-nowrap mt-6">
                Create a List
              </div>
              <p className="font-bold text-medium-gray tracking-[0] text-base mt-3">
                Every great recommendation starts with a list. Give your list a catchy name. For instance, &#34;My
                Ultimate Travel Adventures&#34; or &#34;Top Tech Gadgets of 2023.&#34;
              </p>
              <div
                className="bg-seaPink rounded-[44px] border border-solid border-black font-medium text-black text-sm whitespace-nowrap text-center p-[14px] mt-5 md:inline-flex md:px-[30px] cursor-pointer"
                onClick={handleActionsClick}>
                Create Yours Now
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mt-16 lg:flex justify-between flex-row-reverse">
            <CoreImage
              className="md:w-[450px]"
              alt="Step 1"
              url={prepareImageUrl('/images/landing-page/step-2.png', ImageSourceType.ASSET)}
              useTransparentPlaceholder
            />
            <div className="lg:w-[500px]">
              <div className="relative font-extrabold text-black tracking-normal text-2xl lg:text-3xl mt-6">
                Add recommendations to the list
              </div>
              <p className="font-bold text-medium-gray tracking-[0] text-base mt-3">
                The heart of your list is the recommendations you share. You can add a wide range of content, from
                YouTube videos to affiliate links. Share what you love!
              </p>
              <div
                className="bg-pictonBlue rounded-[44px] border border-solid border-black font-medium text-black text-sm whitespace-nowrap text-center p-[14px] mt-5 md:inline-flex md:px-[30px] cursor-pointer"
                onClick={handleActionsClick}>
                Start making your lists
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mt-16 lg:flex justify-between">
            <CoreImage
              className="md:w-[450px]"
              alt="Step 1"
              url={prepareImageUrl('/images/landing-page/step-3.png', ImageSourceType.ASSET)}
              useTransparentPlaceholder
            />
            <div className="lg:w-[500px]">
              <div className="relative font-extrabold text-black tracking-normal text-2xl  mt-6">
                Share the list with everyone
              </div>
              <p className="font-bold text-medium-gray tracking-[0] text-base mt-3">
                Once you've curated your list, it's time to share it with the world. Let your recommendations reach a
                global audience and make an impact.
              </p>
              <div
                className="bg-lavenderGray rounded-[44px] border border-solid border-black font-medium text-black text-sm whitespace-nowrap text-center p-[14px] mt-5 md:inline-flex md:px-[30px] cursor-pointer"
                onClick={handleActionsClick}>
                Share your heart out
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="mt-16 lg:flex justify-between flex-row-reverse">
            <CoreImage
              className="md:w-[450px]"
              alt="Step 1"
              url={prepareImageUrl('/images/landing-page/step-4.png', ImageSourceType.ASSET)}
              useTransparentPlaceholder
            />
            <div className="lg:w-[500px]">
              <div className="relative font-extrabold text-black tracking-normal text-2xl  mt-6">
                Track the performance
              </div>
              <p className="font-bold text-medium-gray tracking-[0] text-base mt-3">
                MyLikes offers a suite of tools to help you monitor the performance of your recommendations. Analyze key
                parameters and gain insights into how your list is doing.
              </p>
              <div
                className="bg-mandy rounded-[44px] border border-solid border-black font-medium text-white text-sm whitespace-nowrap text-center p-[14px] mt-5 md:inline-flex md:px-[30px] cursor-pointer"
                onClick={handleActionsClick}>
                Start making your lists
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="mt-16 lg:flex justify-between">
            <CoreImage
              className="md:w-[450px]"
              alt="Step 1"
              url={prepareImageUrl('/images/landing-page/step-5.png', ImageSourceType.ASSET)}
              useTransparentPlaceholder
            />
            <div className="lg:w-[500px]">
              <div className="relative font-extrabold text-black tracking-normal text-2xl  mt-6">
                Features to engage users with your list
              </div>
              <p className="font-bold text-medium-gray tracking-[0] text-base mt-3">
                MyLikes isn't just about sharing; it's about engaging. We provide you with a wealth of features to
                captivate your audience.
              </p>
              <div
                className="bg-morningGlory rounded-[44px] border border-solid border-black font-medium text-black text-sm whitespace-nowrap text-center p-[14px] mt-5 md:inline-flex md:px-[30px] cursor-pointer"
                onClick={handleActionsClick}>
                Get going today
              </div>
            </div>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="mt-20 bg-tautara  px-4 lg:px-20 py-20 flex flex-col items-center lg:flex-row-reverse lg:justify-between">
          <CoreImage
            className="w-56 lg:w-64"
            alt="Ellipse"
            url={prepareImageUrl('/images/landing-page/banner-2-preview.png', ImageSourceType.ASSET)}
            useTransparentPlaceholder
          />
          <div className="lg:w-[600px] md:flex flex-col items-center lg:items-start">
            <p className="font-bold text-transparent text-[40px] text-center lg:text-left tracking-[0] leading-[48px] mt-8">
              <span className="text-white">With MyLikes, you&#39;re not just </span>
              <span className="text-morningGlory">sharing</span>
              <span className="text-white">; you&#39;re building a </span>
              <span className="text-lavenderGray">community</span>
              <span className="text-white"> around your </span>
              <span className="text-amaranth">passions</span>
              <span className="text-white">.</span>
            </p>
            <div
              className="bg-creamCan rounded-[44px] border border-solid border-black font-medium text-[14px] tracking-[0] leading-[14px] whitespace-nowrap text-center p-[14px] mt-8 w-full md:w-auto md:inline-flex md:px-[30px] cursor-pointer"
              onClick={handleActionsClick}>
              Get Started
            </div>
          </div>
        </div>

        {/* Featured lists */}
        {featuredListsShelf && (
          <div className="mt-12">
            <div className="font-bold text-black text-3xl text-center">Featured lists</div>
            <div className="mt-10 px-3">
              <ShelfLists shelf={featuredListsShelf} source="home" showHeader={false} />
              <div className="flex justify-center">
                <CoreLink
                  url={getFeaturedListsPageUrl()}
                  className="bg-alabaster rounded-[44px] border border-solid border-black text-black font-medium text-[14px] tracking-[0] leading-[14px] whitespace-nowrap text-center p-[14px] mt-6 w-full md:w-auto md:inline-flex md:px-[30px]">
                  View All
                </CoreLink>
              </div>
            </div>
          </div>
        )}

        {/* Ppopular recommendations */}
        {/* <div className="mt-10">
          <div className="font-bold text-black text-3xl  text-center">Popular recommendations</div>
        </div> */}

        {/* Banner 3 */}
        <div className="bg-creamCan flex flex-col items-center mt-[120px] px-4 lg:px-24 py-20 relative">
          <CoreImage
            className="w-40 absolute left-[50%] transform translate-x-[-50%] -top-[80px] lg:left-[85%]"
            alt="Ellipse"
            url={prepareImageUrl('/images/landing-page/banner-3-preview.png', ImageSourceType.ASSET)}
            useTransparentPlaceholder
          />

          <div className="font-bold text-black text-4xl leading-[48px] text-center tracking-[0] mt-10">
            Whether you&#39;re an expert foodie, a fashion aficionado, a tech guru, or an explorer of hidden gems,
            MyLikes is your stage to shine.
          </div>
          <div
            className="bg-mandy rounded-[44px] border border-solid border-black text-white font-medium text-[14px] tracking-[0] leading-[14px] whitespace-nowrap text-center p-[14px] mt-8 w-full md:w-auto md:inline-flex md:px-[30px] cursor-pointer"
            onClick={handleActionsClick}>
            Get Started
          </div>
        </div>
      </div>
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
      ads: {
        stickyBanner: {
          show: {
            desktop: false,
            mobile: false,
          },
        },
      },
    },
  }
}

export default Home
