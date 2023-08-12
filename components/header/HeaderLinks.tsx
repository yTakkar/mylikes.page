import classnames from 'classnames'
import React from 'react'
import CoreActiveLink from '../core/CoreActiveLink'
import Tooltip from '../Tooltip'

export interface IHeaderLink {
  label: string | null
  url: string | null
  iconComponent: React.FC<any> | null
  activeIconComponent: React.FC<any> | null
  iconClassName: string | null
  count: string | null
  onClick: ((e: any) => void) | null
  show: boolean
  tooltipContent?: React.ReactNode
}

interface IHeaderLinksProps {
  links: IHeaderLink[]
}

const HeaderLinks: React.FC<IHeaderLinksProps> = props => {
  const mappedLinks = props.links.map((navLink, index) => {
    if (!navLink.show) {
      return null
    }

    return (
      <CoreActiveLink
        key={index}
        url={navLink.url}
        className="flex font-primary-medium text-typo-paragraph text-sm items-center group relative ml-4 lg:ml-5"
        title={navLink.label || ''}
        onClick={e => {
          if (navLink.onClick) {
            navLink.onClick(e)
          }
        }}>
        {(isActive: boolean) => {
          const IconComponent =
            (isActive && navLink.activeIconComponent ? navLink.activeIconComponent : navLink.iconComponent) ||
            (() => null)

          return (
            <React.Fragment>
              <Tooltip content={navLink.tooltipContent}>
                <span>
                  <IconComponent
                    className={classnames(
                      'w-[24px] transform transition-transform group-hover:scale-105',
                      navLink.iconClassName
                    )}
                  />
                </span>
              </Tooltip>
              <span className="ml-1">{navLink.label}</span>
              {navLink.count && !isActive ? (
                <span className="absolute -right-3 -top-4 bg-primary text-xxs text-white rounded-lg py-[1px] px-1 font-primary-medium">
                  {navLink.count}
                </span>
              ) : null}
            </React.Fragment>
          )
        }}
      </CoreActiveLink>
    )
  })

  return <>{mappedLinks}</>
}

export default HeaderLinks
