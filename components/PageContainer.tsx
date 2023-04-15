import React, { PropsWithChildren } from 'react'

interface IPageContainerProps extends PropsWithChildren {}

const PageContainer: React.FC<IPageContainerProps> = props => {
  return <div className="container mx-auto min-h-[68vh]">{props.children}</div>
}

export default PageContainer
