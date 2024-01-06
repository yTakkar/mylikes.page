import React, { PropsWithChildren, ReactNode, useEffect, useRef } from 'react'
import useEscape from '../../hooks/useEscape'
import useOutsideClick from '../../hooks/useOutsideClick'
import usePortal from '../../hooks/usePortal'
import { XIcon } from '@heroicons/react/solid'
import { addBlur, removeBlur } from '../../utils/common'
import classnames from 'classnames'
import useDisablePageScrolling from '../../hooks/useDisablePageScrolling'
import Container from '../Container'

export interface IModalProps extends PropsWithChildren {
  dismissModal: () => void
  title?: ReactNode
  subTitle?: ReactNode
  className?: string
  showCrossIcon?: boolean
  disableOutsideClick?: boolean
  wrapInContainer?: boolean
  showHeader?: boolean
}

const Modal: React.FC<IModalProps> = props => {
  const {
    dismissModal,
    title,
    subTitle,
    className,
    showCrossIcon = true,
    children,
    disableOutsideClick = false,
    wrapInContainer = false,
    showHeader = true,
  } = props

  const ref = useRef<HTMLDivElement | null>(null)

  const Portal = usePortal()

  useEffect(() => {
    addBlur()
    return () => {
      removeBlur()
    }
  }, [])

  useDisablePageScrolling()
  useEscape(() => dismissModal())
  useOutsideClick({
    ref,
    onOutsideClick: () => {
      if (!disableOutsideClick) {
        dismissModal()
      }
    },
  })

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-start p-3 modal-header">
        <div>
          <div className="font-bold text-typo-title modal-header-title">{title}</div>
          {subTitle && <div className="text-sm mt-1">{subTitle}</div>}
        </div>
        {showCrossIcon ? (
          <XIcon className="w-6 text-gray-700 font-bold cursor-pointer" onClick={() => dismissModal()} />
        ) : null}
      </div>
    )
  }

  return (
    <Portal>
      <div id="Modal" className="fixed z-20 left-0 top-0 w-full h-full bg-blackLight overflow-hidden">
        <div
          className={classnames(
            'z-20 bg-white w-auto md:w-[600px] md:mx-auto mx-3 mt-14 rounded-lg shadow-modal',
            className
          )}
          ref={ref}>
          {showHeader ? wrapInContainer ? <Container>{renderHeader()}</Container> : renderHeader() : null}
          {wrapInContainer ? (
            <Container className="modal-body">
              <div>{children}</div>
            </Container>
          ) : (
            <div className="modal-body">{children}</div>
          )}
        </div>
      </div>
    </Portal>
  )
}

export default Modal
