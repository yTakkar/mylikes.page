import React from 'react'
import { IListDetail, ListVisibilityType } from '../../interface/list'
import CoreLink from '../core/CoreLink'
import { getListPageUrl } from '../../utils/routes'
import { LockClosedIcon } from '@heroicons/react/solid'
import FeaturedLabel from '../FeaturedLabel'
import classNames from 'classnames'
import RecommendationTypeIcon from '../recommendation/RecommendationTypeIcon'

interface IListInfoProps {
  list: IListDetail
  sponsored?: boolean
  className?: string
  onClick?: () => void
}

const ListInfo: React.FC<IListInfoProps> = props => {
  const { list, sponsored = false, className, onClick } = props

  const MAX_RECOMMENDATIONS = 4

  const recommendationsToDisplay = list.recommendations.slice(0, MAX_RECOMMENDATIONS)

  return (
    <CoreLink
      url={getListPageUrl(list.id)}
      className={classNames(
        'border border-mercury transition-all shadow-listInfo rounded transform hover:-translate-y-1 cursor-pointer group',
        className
      )}
      onClick={onClick}>
      {sponsored && (
        <div className="absolute right-2 top-2">
          <FeaturedLabel />
        </div>
      )}

      <div className="p-4 flex items-center justify-center min-h-[150px] shadow-listInfoImages">
        {recommendationsToDisplay.length === 0 ? (
          <div className="italic text-gray-600">The list is empty</div>
        ) : (
          recommendationsToDisplay.map((recommendation, index) => (
            <div key={index} className="relative mr-2 w-14 h-14 min-w-14 min-h-14">
              <RecommendationTypeIcon recommendation={recommendation} source="list" />
            </div>
          ))
        )}
      </div>

      <div className="bg-alabaster py-3 px-4 flex items-center justify-between">
        <div className="w-full">
          <div className="font-bold overflow-hidden whitespace-nowrap text-ellipsis">{list.name}</div>
          <div className=" text-typo-paragraphLight text-sm">{list.recommendations.length} recommendations</div>
        </div>

        <div>
          {list.visibility === ListVisibilityType.PRIVATE && (
            <LockClosedIcon className="w-5 text-gray-500 group-hover:text-gray-600" />
          )}
        </div>
      </div>
    </CoreLink>
  )
}

export default ListInfo
