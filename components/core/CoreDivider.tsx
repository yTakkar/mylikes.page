import React from 'react'
import classnames from 'classnames'

interface ICoreDividerProps {
  className?: string
}

const CoreDivider: React.FC<ICoreDividerProps> = props => {
  const { className } = props

  return <div className={classnames('h-2 bg-whisper mx-0', className)}></div>
}

export default CoreDivider
