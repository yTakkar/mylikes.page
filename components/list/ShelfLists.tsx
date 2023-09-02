import React from 'react'
import { IShelfDetail } from '../../interface/shelf'
import ListInfo from './ListInfo'
import classNames from 'classnames'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { useRouter } from 'next/router'

interface IShelfListsProps {
  shelf: IShelfDetail
  source: '404' | 'error'
}

const ShelfLists: React.FC<IShelfListsProps> = props => {
  const { shelf, source } = props

  const MAX_LISTS = 3

  const router = useRouter()

  return (
    <div>
      <div className="text-base lg:text-lg font-medium font-primary-medium mb-2 lg:mb-3">{shelf.name}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6 mt-4 lg:mt-0">
        {shelf.listInfos.map((list, index) => {
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
