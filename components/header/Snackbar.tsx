import React from 'react'
import { useRouter } from 'next/router'
import CoreLink from '../core/CoreLink'
import classnames from 'classnames'
import { routerPageBack } from '../../utils/common'
import usePWAInstall from '../../hooks/usePWAInstall'
import { getSearchPageUrl } from '../../utils/routes'
import { ArrowLeftIcon, PlusIcon, UserIcon } from '@heroicons/react/outline'

interface ISnackbarProps {
  title?: React.ReactNode
  showBackIcon?: boolean
  backUrl?: string
}

const Snackbar: React.FC<ISnackbarProps> = props => {
  const { title, showBackIcon = true, backUrl } = props

  const router = useRouter()

  const { showPWAInstall, showPWAInstallPrompt } = usePWAInstall()

  const handleBackIconClick = () => {
    routerPageBack(router, backUrl)
  }

  return (
    <div className="bg-white h-12 sticky top-0 left-0 right-0 flex items-center justify-between text-typo-paragraph px-3 z-10 shadow-md">
      <div className={classnames('flex items-center', showPWAInstall ? 'w-[80%]' : 'w-[90%]')}>
        {showBackIcon ? (
          <div className="mr-3" onClick={handleBackIconClick}>
            <ArrowLeftIcon className="w-6" />
          </div>
        ) : null}
        <div className="w-11/12">
          <div className="text-base truncate">{title}</div>
        </div>
      </div>
      <div className="flex items-center">
        {showPWAInstall ? (
          <span className="text-typo-paragraph" onClick={() => showPWAInstallPrompt()}>
            <PlusIcon className="w-6 mr-3 animation-shakeX" />
          </span>
        ) : null}

        <CoreLink url={getSearchPageUrl()} className="text-typo-paragraph">
          <UserIcon className="w-5 " />
        </CoreLink>
      </div>
    </div>
  )
}

export default Snackbar
