import React from 'react'
import classnames from 'classnames'

interface ICoreCheckboxProps {
  onChange: (val: boolean) => void
  id: string
  checked: boolean
  label?: React.ReactNode
  className?: string
  disabled?: boolean
}

const CoreCheckbox: React.FC<ICoreCheckboxProps> = props => {
  const { onChange, id, label, checked, className, disabled } = props

  return (
    <div className={classnames('radio-button flex items-baseline', className)}>
      <input
        type="checkbox"
        id={id}
        onChange={e => onChange(e.target.checked)}
        checked={checked}
        disabled={disabled}
        className="cursor-pointer"
      />
      {label ? (
        <label htmlFor={id} className="ml-2 cursor-pointer">
          {label}
        </label>
      ) : null}
    </div>
  )
}

export default CoreCheckbox
