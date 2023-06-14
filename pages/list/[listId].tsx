import React from 'react'
import { IGlobalLayoutProps } from '../_app'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import PageLoader from '../../components/loader/PageLoader'
import { prepareListPageSeo } from '../../utils/seo/pages/list'
import PageContainer from '../../components/PageContainer'
import { IListDetail } from '../../interface/list'
import { PlusIcon } from '@heroicons/react/outline'
import CoreDivider from '../../components/core/CoreDivider'
import { DesktopView } from '../../components/ResponsiveViews'
import RecommendationInfo, {
  RecommendationInfoLayoutType,
  RecommendationInfoSourceType,
} from '../../components/recommendation/RecommendationInfo'

interface IProps extends IGlobalLayoutProps {
  pageData: {
    listDetail: IListDetail
  }
}

const List: NextPage<IProps> = (props: IProps) => {
  const router = useRouter()

  if (router.isFallback || !props.pageData) {
    return <PageLoader />
  }

  const actions = [
    {
      label: 'List Settings',
    },
    {
      label: (
        <div className="flex">
          <PlusIcon className="w-4 mr-1" />
          Add a recommendation
        </div>
      ),
    },
  ]

  return (
    <PageContainer>
      <div className="px-3 lg:px-0">
        <div className="lg:my-8 lg:text-center">
          <div className="font-domaine-bold font-bold text-3xl mb-1 lg:mb-3 lg:text-5xl">{'Something'}</div>
          <div className="text-typo-paragraphLight">by {'Faiyaz Shaikh'}</div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            {actions.map((action, index) => (
              <div
                key={index}
                className="bg-gallery font-medium text-sm cursor-pointer py-1 px-2 rounded-lg font-primary-medium mr-2">
                {action.label}
              </div>
            ))}
          </div>
          <DesktopView useCSS>
            <div className="text-typo-paragraphLight">4 recommendations on this list</div>
          </DesktopView>
        </div>

        <CoreDivider className="my-8" />

        <div>
          {Array.from({ length: 10 }).map((_, index) => (
            <RecommendationInfo
              key={index}
              layout={RecommendationInfoLayoutType.INLINE}
              source={RecommendationInfoSourceType.LIST}
            />
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any = ['something', 'anything'].map(listId => ({
    params: {
      listId,
    },
  }))

  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<IProps> = async () => {
  return {
    props: {
      pageData: {
        listDetail: {} as any,
      },
      seo: prepareListPageSeo(),
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
    // revalidate: PAGE_REVALIDATE_TIME.PROFILE,
  }
}

export default List
