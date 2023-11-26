import React, { PropsWithChildren, useContext } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css' // optional
import 'tippy.js/dist/border.css' // optional
import 'tippy.js/dist/svg-arrow.css' // optional
import 'tippy.js/dist/backdrop.css' // optional
import ApplicationContext from './ApplicationContext'

interface ITooltipProps extends PropsWithChildren {
  content: React.ReactNode
  disableOnMobile?: boolean
}

const Tooltip: React.FC<ITooltipProps> = props => {
  const { content, children, disableOnMobile } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { isMobile },
  } = applicationContext

  if (!content) {
    return <>{children}</>
  }

  if (disableOnMobile && isMobile) {
    return <>{children}</>
  }

  return (
    <Tippy content={content} maxWidth={500} trigger="mouseenter focus click">
      {children as any}
    </Tippy>
  )
}

export default Tooltip
