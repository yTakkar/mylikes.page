import React from 'react'
import { IListDetail, ListVisibilityType } from '../../interface/list'
import CoreImage from '../core/CoreImage'
import CoreLink from '../core/CoreLink'
import { getListPageUrl } from '../../utils/routes'
import { LockClosedIcon } from '@heroicons/react/solid'

interface IListInfoProps {
  list: IListDetail
}

const ListInfo: React.FC<IListInfoProps> = props => {
  const { list } = props

  const MAX_IMAGES = 4

  const imagesToDisplay = list.recommendations.map(rec => rec.imageUrl).slice(0, MAX_IMAGES)

  return (
    <CoreLink
      url={getListPageUrl(list.id)}
      className="border border-mercury transition-all shadow-listInfo rounded transform hover:-translate-y-1 cursor-pointer group">
      <div className="p-4 flex items-center justify-center min-h-[150px] shadow-listInfoImages">
        {imagesToDisplay.length === 0 ? (
          <div className="italic text-gray-600">The list is empty</div>
        ) : (
          imagesToDisplay.map((image, index) => (
            <CoreImage key={index} url={image} alt={image} className="w-14 shadow-listInfoImage mr-2" />
          ))
        )}
      </div>

      <div className="bg-alabaster py-3 px-4 flex items-center justify-between">
        <div>
          <div className="font-medium font-primary-medium">{list.name}</div>
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
