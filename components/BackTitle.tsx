import React from 'react'
import { useRouter } from 'next/router'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import classnames from 'classnames'
import { routerPageBack } from '../utils/common'

interface IBackTitleProps {
  title: string
  backUrl?: string
  className?: string
  rhsContent?: React.ReactNode
}

const BackTitle: React.FC<IBackTitleProps> = props => {
  const { title, backUrl, className, rhsContent } = props

  const router = useRouter()

  const handleBackIconClick = () => {
    routerPageBack(router, backUrl)
  }

  return (
    <div className={classnames('mt-4 mb-6 flex items-center justify-between', className)}>
      <div className="inline-flex items-center">
        <div
          className="w-6 text-typo-paragraph mr-3 cursor-pointer rounded-full relative transform transition-transform hover:scale-110"
          onClick={handleBackIconClick}>
          <ArrowLeftIcon className="" />
        </div>
        <div className="font-bold text-typo-paragraph text-lg">{title}</div>
      </div>

      {rhsContent}
    </div>
  )
}

export default BackTitle
