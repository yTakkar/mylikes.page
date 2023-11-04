import React from 'react'
import { IRecommendationInfo, RecommendationType } from '../../interface/recommendation'
import {
  DocumentTextIcon,
  LinkIcon,
  PhotographIcon,
  PlayIcon,
  ShoppingCartIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid'
import classNames from 'classnames'

interface IProps {
  recommendation: IRecommendationInfo
  source: 'list' | 'recommendation'
}

const RecommendationTypeIcon: React.FC<IProps> = props => {
  const { source, recommendation } = props

  const TYPE_COLOR_MAP = {
    [RecommendationType.PRODUCT]: 'bg-[#4081EF]',
    [RecommendationType.BLOG]: 'bg-[#191919]',
    [RecommendationType.VIDEO]: 'bg-[#E64232]',
    [RecommendationType.AUDIO]: 'bg-[#F6B800]',
    [RecommendationType.IMAGE]: 'bg-[#30A452]',
    [RecommendationType.OTHER]: 'bg-[#eaeaea]',
  }

  const iconPadding = source === 'list' ? 'p-3' : 'p-2'

  const TYPE_ICON_MAP = {
    [RecommendationType.PRODUCT]: <ShoppingCartIcon className={classNames(iconPadding, 'w-full h-full text-white')} />,
    [RecommendationType.BLOG]: <DocumentTextIcon className={classNames(iconPadding, 'w-full h-full text-white')} />,
    [RecommendationType.VIDEO]: <PlayIcon className={classNames(iconPadding, 'w-full h-full text-white')} />,
    [RecommendationType.AUDIO]: <VolumeUpIcon className={classNames(iconPadding, 'w-full h-full text-white')} />,
    [RecommendationType.IMAGE]: <PhotographIcon className={classNames(iconPadding, 'w-full h-full text-white')} />,
    [RecommendationType.OTHER]: <LinkIcon className={classNames(iconPadding, 'w-full h-full')} />,
  }

  const bg = TYPE_COLOR_MAP[recommendation.type] || TYPE_COLOR_MAP[RecommendationType.OTHER]
  const icon = TYPE_ICON_MAP[recommendation.type] || TYPE_ICON_MAP[RecommendationType.OTHER]

  return <div className={classNames(`${bg} w-full h-full rounded-full flex justify-center items-center`)}>{icon}</div>
}

export default RecommendationTypeIcon
