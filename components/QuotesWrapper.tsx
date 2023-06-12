import React from 'react'

interface IQuotesWrapperProps {
  text: string
}

const QuotesWrapper: React.FC<IQuotesWrapperProps> = props => {
  const { text } = props
  return <span className="quotes-wrapper">&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;</span>
}

export default QuotesWrapper
