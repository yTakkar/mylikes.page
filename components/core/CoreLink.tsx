import React, { ReactNode, CSSProperties } from 'react'
import NextLink from 'next/link'
import appConfig from '../../config/appConfig'

export interface ICoreLinkProps {
  url: string | null
  className?: string
  isExternal?: boolean
  style?: CSSProperties
  title?: string
  onClick?: (e: any) => void
  children: ReactNode
}

const CoreLink: React.FC<ICoreLinkProps> = props => {
  const { url, className, isExternal, style, title, onClick, children } = props

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = e => {
    if (onClick) onClick(e)
  }

  if ((url && url.indexOf('http') === 0) || !url) {
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        href={url || 'javascript:;'}
        className={className}
        target={isExternal ? '_blank' : '_parent'}
        rel={isExternal ? 'noopener' : ''}
        style={style}
        title={title}
        onClick={handleClick}>
        {children}
      </a>
    )
  }

  return (
    <NextLink
      href={url}
      prefetch={appConfig.features.enablePagesPrefetching}
      className={className}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener' : ''}
      style={style}
      title={title}
      onClick={handleClick}
      data-hover={typeof children === 'string' ? children : ''}>
      {children}
    </NextLink>
  )
}

export default CoreLink
