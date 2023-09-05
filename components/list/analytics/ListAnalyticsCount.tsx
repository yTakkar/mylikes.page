import { InformationCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import Tooltip from '../../Tooltip'
import appConfig from '../../../config/appConfig'

interface IListAnalyticsCountProps {
  count: number
  infoText: string
}

const ListAnalyticsCount: React.FC<IListAnalyticsCountProps> = props => {
  return (
    <div className="flex items-center flex-col mb-6">
      <div className="font-bold lg:text-lg inline-flex items-center">
        <span>Overall count</span>
        <Tooltip
          content={`${props.infoText} Updates every ${appConfig.analytics.cacheInvalidationTimeInSec / 60} minutes.`}>
          <span>
            <InformationCircleIcon className="w-5 ml-1 text-brand-primary" />
          </span>
        </Tooltip>
      </div>
      <div className="text-xl font-medium lg:text-2xl">{props.count}</div>
    </div>
  )
}

export default ListAnalyticsCount
