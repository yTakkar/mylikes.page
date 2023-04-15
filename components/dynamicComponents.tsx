import dynamic from 'next/dynamic'

export const DynamicPageTransition: any = dynamic(() =>
  // @ts-ignore
  import(/* webpackChunkName: "PageTransition" */ 'next-page-transitions').then(resp => {
    return resp.PageTransition
  })
)
