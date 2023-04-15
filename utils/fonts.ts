import localFont from 'next/font/local'

export const national2Font = localFont({
  src: [
    {
      path: '../public/fonts/national2/national2-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/national2/national2-medium.woff2',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../public/fonts/national2/national2-bold.woff2',
      weight: '700',
      style: 'bold',
    },
  ],
})
