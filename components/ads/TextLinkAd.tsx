import { GiftIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import { getRandomArrayItem } from '../../utils/array'
import { TEXT_LINK_AD_LIST } from '../../constants/ads'
import { getLinkAd } from '../../utils/ads'

interface ITextLinkAdProps {
  onLinkClick?: () => void
}

const TextLinkAd: React.FC<ITextLinkAdProps> = props => {
  const { onLinkClick } = props

  const [randomTextAd, setRandomTextAd] = useState({ title: '', description: '' })

  useEffect(() => {
    setRandomTextAd(getRandomArrayItem(TEXT_LINK_AD_LIST))
  }, [])

  const handleClick = () => {
    onLinkClick?.()
    window.open(getLinkAd(), '_blank', 'noopener')
  }

  return (
    <div className={'flex pt-3 pb-3 md:mb-5 relative cursor-pointer'} onClick={handleClick}>
      <div className="relative w-10 h-10 min-w-10 min-h-10 top-1">
        <div className={`w-full h-full rounded-full flex justify-center items-center bg-clementine`}>
          <GiftIcon className={'p-2 w-full h-full text-white'} />
        </div>
        <div className="flex items-center relative justify-center bg-brand-secondary text-white rounded p-[2px] px-1 mt-1 font-semibold text-xs">
          <span>Ad</span>
        </div>
      </div>
      <div className="ml-3 flex-grow">
        <div className={'text-base md:text-lg md:leading-[25px]'}>
          <span className="font-bold">{randomTextAd.title}</span>
        </div>

        <div className="text-typo-paragraphLight text-sm inline leading-4">{randomTextAd.description}</div>
      </div>
    </div>
  )
}

export default TextLinkAd
