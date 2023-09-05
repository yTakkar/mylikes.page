import classNames from 'classnames'
import React, { PropsWithChildren } from 'react'

interface IContainerProps extends PropsWithChildren {
  className?: string
}

const Container: React.FC<IContainerProps> = props => {
  const { className } = props
  return <div className={classNames('container mx-auto', className)}>{props.children}</div>
}

export default Container
