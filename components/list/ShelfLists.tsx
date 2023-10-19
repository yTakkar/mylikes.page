import React, { useContext } from 'react'
import { IShelfDetail } from '../../interface/shelf'
import ListInfo from './ListInfo'
import classNames from 'classnames'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'
import { useRouter } from 'next/router'
import ApplicationContext from '../ApplicationContext'

interface IShelfListsProps {
  shelf: IShelfDetail
  source: '404' | 'error' | 'home'
  showHeader?: boolean
}

const ShelfLists: React.FC<IShelfListsProps> = props => {
  const { shelf, source, showHeader = true } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    device: { profile },
  } = applicationContext

  const router = useRouter()

  let MAX_LISTS = 3

  if (profile === 'LG') {
    MAX_LISTS = 4
  }

  return (
    <div>
      {showHeader && <div className="text-base lg:text-lg font-bold mb-4">{shelf.name}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
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
