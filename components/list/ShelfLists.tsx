import React, { useContext, useEffect, useMemo, useState } from 'react'
import { IShelfDetail } from '../../interface/shelf'
import ListInfo from './ListInfo'
import classNames from 'classnames'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { useRouter } from 'next/router'
import ApplicationContext from '../ApplicationContext'
import CoreLink from '../core/CoreLink'
import Tooltip from '../Tooltip'
import { ArrowRightIcon } from '@heroicons/react/outline'
import { getFeaturedListsPageUrl, getShelfPageUrl } from '../../utils/routes'
import { shuffle } from '../../utils/array'

interface IShelfListsProps {
  shelf: IShelfDetail
  source: '404' | 'error' | 'home' | 'list'
  showHeader?: boolean
}

const ShelfLists: React.FC<IShelfListsProps> = props => {
  const { shelf, source, showHeader = true } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { profile },
  } = applicationContext

  const router = useRouter()

  const lists = useMemo(() => shuffle(shelf.listInfos).slice(0, 4), [shelf.listInfos])

  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  let MAX_LISTS = 3

  if (!isBrowser) {
    return null
  }

  if (profile === 'LG') {
    MAX_LISTS = 4
  }

  return (
    <div>
      {showHeader && (
        <div className="text-base lg:text-lg font-bold mb-4 flex justify-between">
          {shelf.name}

          <CoreLink url={shelf.id === 'featured-lists' ? getFeaturedListsPageUrl() : getShelfPageUrl(shelf.id)}>
            <Tooltip content="View more" disableOnMobile>
              <span>
                <ArrowRightIcon className="w-5 ml-2" />
              </span>
            </Tooltip>
          </CoreLink>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
        {lists.map((list, index) => {
          const hide = index + 1 > MAX_LISTS
          return (
            <ListInfo
              key={list.id}
              list={list}
              className={classNames({
                'hidden xl:block': hide,
              })}
              onClick={() => {
                appAnalytics.sendEvent({
                  action: AnalyticsEventType.FEATURED_SHELF_LIST_VISIT,
                  extra: {
                    shelfId: shelf.id,
                    listId: list.id,
                    source,
                    path: router.asPath,
                  },
                })
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ShelfLists
