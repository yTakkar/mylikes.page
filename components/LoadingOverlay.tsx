import React from 'react'
import { LoaderCustomIcon } from './custom-icons'

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-0">
      <div className="flex items-center justify-center">
        <LoaderCustomIcon className="w-10" />
      </div>
    </div>
  )
}

export default LoadingOverlay
