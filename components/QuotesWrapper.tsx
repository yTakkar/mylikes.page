import { PencilIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import React from 'react'

interface IQuotesWrapperProps {
  text: string
  className?: string
  allowEdit?: boolean
  onClick?: () => void
}

const QuotesWrapper: React.FC<IQuotesWrapperProps> = props => {
  const { text, className, allowEdit, onClick } = props
  return (
    <>
      <span className={classNames('quotes-wrapper', className)} onClick={onClick}>
        &nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;{' '}
      </span>
      {allowEdit && (
        <PencilIcon className="w-4 ml-4 text-typo-paragraphLight cursor-pointer inline" onClick={onClick} />
      )}
    </>
  )
}

export default QuotesWrapper
