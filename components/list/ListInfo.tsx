import React from 'react'
import { IListDetail } from '../../interface/list'
import { generateRecommendationImageUrl } from '../../utils/recommendation'
import CoreImage from '../core/CoreImage'
import { PencilIcon } from '@heroicons/react/solid'

interface IListInfoProps {
  // list: IListDetail
}

const ListInfo: React.FC<IListInfoProps> = props => {
  const images = [
    generateRecommendationImageUrl('https://www.tiktok.com'),
    generateRecommendationImageUrl('https://www.instagram.com'),
    generateRecommendationImageUrl('https://www.twitter.com'),
    generateRecommendationImageUrl('https://www.youtube.com'),
    generateRecommendationImageUrl('https://www.producthunt.com'),
    generateRecommendationImageUrl('https://www.github.com'),
    generateRecommendationImageUrl('https://www.tiktok.com'),
    generateRecommendationImageUrl('https://www.instagram.com'),
    generateRecommendationImageUrl('https://www.twitter.com'),
    generateRecommendationImageUrl('https://www.youtube.com'),
    generateRecommendationImageUrl('https://www.producthunt.com'),
    generateRecommendationImageUrl('https://www.github.com'),
  ]

  const maxImages = 4

  const imagesToDisplay = images.slice(0, maxImages)

  return (
    <div className="border border-mercury transition-all shadow-listInfo rounded transform hover:-translate-y-1 cursor-pointer group">
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
          <div className="font-medium font-primary-medium">Name</div>
          <div className=" text-typo-paragraphLight text-sm">6 recommendations</div>
        </div>

        <div>
          <PencilIcon className="w-5 text-gray-500 group-hover:text-gray-600" />
        </div>
      </div>
    </div>
  )
}

export default ListInfo
