import React, { useContext } from 'react'
import CoreImage from '../core/CoreImage'
import classNames from 'classnames'
import ApplicationContext from '../ApplicationContext'

interface IHeaderProfileIconProps {
  className: string
  active: boolean
}

const HeaderProfileIcon: React.FC<IHeaderProfileIconProps> = props => {
  const { className, active } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  return (
    <CoreImage
      url={user?.avatarUrl || ''}
      className={classNames(className, 'rounded-full mr-1', {
        'ring-2 ring-brand-primary': active,
      })}
      alt={user?.name || ''}
      useTransparentPlaceholder
    />
  )
}

export default HeaderProfileIcon
