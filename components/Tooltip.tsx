import React, { PropsWithChildren } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css' // optional
import 'tippy.js/dist/border.css' // optional
import 'tippy.js/dist/svg-arrow.css' // optional
import 'tippy.js/dist/backdrop.css' // optional

interface ITooltipProps extends PropsWithChildren {
  content: string
}

const Tooltip: React.FC<ITooltipProps> = props => {
  const { content, children } = props
  return <Tippy content={content}>{children as any}</Tippy>
}

export default Tooltip
