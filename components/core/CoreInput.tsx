import React, { useRef } from 'react'
import { BackspaceIcon } from '@heroicons/react/solid'
import classnames from 'classnames'
import { getSanitizedValue } from '../../utils/form'

export enum CoreTextInputType {
  TEXT = 'text',
  PASSWORD = 'password',
  EMAIL = 'email',
  TEL = 'tel',
  NUMBER = 'number',
}

interface ICoreInputProps {
  type: CoreTextInputType
  value: string
  setValue: (value: string) => void
  placeholder: string
  disabled?: boolean
  autoFocus?: boolean
  autoComplete?: string
  showClearIcon?: boolean
  maxLength?: number
  onClearClick?: (value: string) => void
  inputClassName?: string
  className?: string
  sanitizeOnBlur?: boolean
}

const CoreTextInput = React.forwardRef<any, ICoreInputProps>((props, ref) => {
  const {
    type,
    value,
    setValue,
    placeholder,
    disabled,
    autoFocus,
    autoComplete,
    showClearIcon = false,
    onClearClick,
    inputClassName,
    className,
    maxLength,
    sanitizeOnBlur = false,
  } = props

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputRef: any = ref || useRef<HTMLInputElement | null>(null)

  return (
    <div className={classnames('relative', className)}>
      <input
        type={type}
        ref={inputRef}
        className={classnames(
          {
            'pr-8-important': showClearIcon,
          },
          inputClassName
        )}
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={e => {
          if (sanitizeOnBlur) {
            setValue(getSanitizedValue(e.target.value))
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        spellCheck="false"
        autoFocus={autoFocus}
        maxLength={maxLength}
      />
      {value && showClearIcon ? (
        <div className="absolute right-2 top-1/2 w-6 -translate-y-1/2 transform cursor-pointer" title="Clear">
          <BackspaceIcon
            className="transform text-typo-title transition-transform hover:scale-110"
            onClick={() => {
              if (onClearClick) onClearClick(value)
              inputRef.current.focus()
            }}
          />
        </div>
      ) : null}
    </div>
  )
})

CoreTextInput.displayName = 'CoreTextInput'

export default CoreTextInput
