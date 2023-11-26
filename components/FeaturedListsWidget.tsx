import React, { useContext } from 'react'
import ApplicationContext from './ApplicationContext'
import { shuffle } from '../utils/array'
import { ArrowRightIcon, CollectionIcon } from '@heroicons/react/outline'
import CoreLink from './core/CoreLink'
import { getFeaturedListsPageUrl, getListPageUrl } from '../utils/routes'
import { pluralize } from '../utils/common'
import { SpeakerphoneIcon } from '@heroicons/react/solid'
import Tooltip from './Tooltip'

interface IFeaturedListsWidgetProps {}

const FeaturedListsWidget: React.FC<IFeaturedListsWidgetProps> = () => {
  const applicationContext = useContext(ApplicationContext)
  const {
    ads: { featuredListsShelf },
  } = applicationContext

  const lists = shuffle(featuredListsShelf?.listInfos || [])
  const listsToRender = lists.slice(0, 3)

  return (
    <div className="mb-4 mt-6">
      <div className="flex mb-2 font-bold justify-between">
        <div className="flex">
          <SpeakerphoneIcon className="w-5 mr-1 text-brand-secondary" /> Featured Lists
        </div>

        <CoreLink url={getFeaturedListsPageUrl()}>
          <Tooltip content="View more" disableOnMobile>
            <span>
              <ArrowRightIcon className="w-5 ml-2" />
            </span>
          </Tooltip>
        </CoreLink>
      </div>

      <div className=" border-gallery rounded">
        <div className="">
          {listsToRender.map((list, index) => {
            const islast = index === listsToRender.length - 1
            return (
              <CoreLink key={list.id} url={getListPageUrl(list.id)}>
                <div className="flex py-3  border-gallery hover:bg-gray-100 transition-all">
                  <div className="w-10 h-10 min-w-10 min-h-10 mr-2">
                    <div className="bg-[#eaeaea] w-full h-full rounded-full flex justify-center items-center">
                      <CollectionIcon className={'p-2 w-full h-full '} />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">{list.name}</div>
                    <div className="text-sm text-typo-paragraphLight">
                      {pluralize('recommendation', list.recommendations.length)}
                    </div>
                  </div>
                </div>
                {!islast && <div className="w-full h-[1px] bg-gallery" />}
              </CoreLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FeaturedListsWidget
