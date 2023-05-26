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
