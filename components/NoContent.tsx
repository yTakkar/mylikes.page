import React from 'react'
import classnames from 'classnames'
import CoreImage, { ImageSourceType } from './core/CoreImage'
import { prepareImageUrl } from '../utils/image'
import CoreButton, { ICoreButtonProps } from './core/CoreButton'

export enum NoContentType {
  DEFAULT = 'DEFAULT',
}

interface INoContentProps {
  type?: NoContentType
  message?: React.ReactNode
  className?: string
  actions?: ICoreButtonProps[]
  imageClassName?: string
}

const NoContent: React.FC<INoContentProps> = props => {
  const { className, message = 'No content available', actions, imageClassName } = props

  return (
    <div className={classnames('p-5 flex flex-col items-center justify-center', className)}>
      {/* <div className="w-20 h-20 bg-gray300 mb-4"></div> */}
      <div>
        <CoreImage
          url={prepareImageUrl('/images/empty/empty-art.png', ImageSourceType.ASSET)}
          className={classnames('w-80 min-h-52', imageClassName)}
          alt="No content found"
          disableLazyload
        />
      </div>
      <div className="text-center mt-2">{message}</div>
      <div className="flex items-center justify-end mt-2 lg:mt-3">
        {actions?.map((action, index) => (
          <CoreButton key={index} {...action} />
        ))}
      </div>
    </div>
  )
}

export default NoContent
