import dynamic from 'next/dynamic'

export const DynamicPageTransition: any = dynamic(() =>
  // @ts-ignore
  import(/* webpackChunkName: "PageTransition" */ 'next-page-transitions').then(resp => {
    return resp.PageTransition
  })
)

export const DynamicToaster = dynamic(
  () =>
    import(/* webpackChunkName: "react-hot-toast" */ 'react-hot-toast').then(resp => {
      return resp.Toaster
    }),
  {
    ssr: false,
  }
)

// popups
export const DynamicLoginPopup = dynamic(
  () => import(/* webpackChunkName: "LoginPopup" */ 'components/popup/LoginPopup'),
  {
    ssr: false,
  }
)

export const DynamicChangeAvatarPopup = dynamic(
  () => import(/* webpackChunkName: "ChangeAvatarPopup" */ 'components/popup/ChangeAvatarPopup'),
  {
    ssr: false,
  }
)

export const DynamicCreateListPopup = dynamic(
  () => import(/* webpackChunkName: "CreateListPopup" */ 'components/popup/CreateListPopup'),
  {
    ssr: false,
  }
)

export const DynamicAddRecommendationPopup = dynamic(
  () => import(/* webpackChunkName: "AddRecommendationPopup" */ 'components/popup/AddRecommendationPopup'),
  {
    ssr: false,
  }
)

export const DynamicEditRecommendationPopup = dynamic(
  () => import(/* webpackChunkName: "EditRecommendationPopup" */ 'components/popup/EditRecommendationPopup'),
  {
    ssr: false,
  }
)

export const DynamicAddToListPopup = dynamic(
  () => import(/* webpackChunkName: "AddToListPopup" */ 'components/popup/AddToListPopup'),
  {
    ssr: false,
  }
)

export const DynamicListAnalyticsPopup = dynamic(
  () => import(/* webpackChunkName: "ListAnalyticsPopup" */ 'components/popup/ListAnalyticsPopup'),
  {
    ssr: false,
  }
)

export const DynamicAdNotificationPopup = dynamic(
  () => import(/* webpackChunkName: "AdNotificationPopup" */ 'components/popup/AdNotificationPopup'),
  {
    ssr: false,
  }
)
