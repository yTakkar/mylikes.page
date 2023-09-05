import React, { useEffect, useState } from 'react'
import { IListDetail } from '../../../interface/list'
import Loader, { LoaderType } from '../../loader/Loader'
import { getListPageUrl } from '../../../utils/routes'
import { getAddToLibraryTrackingsByList } from '../../../firebase/store/addToLibraryTracking'
import { IAddToLibraryTrackingInfo } from '../../../interface/addToLibraryTracking'
import { getRelativeTime } from '../../../utils/date'
import CoreLink from '../../core/CoreLink'
import appConfig from '../../../config/appConfig'
import ls from 'localstorage-slim'
import appAnalytics from '../../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../../constants/analytics'
import { toastError } from '../../Toaster'
import ListAnalyticsCount from './ListAnalyticsCount'

interface IListAnalyticsLibrarySavesProps {
  listDetail: IListDetail
}

const ListAnalyticsLibrarySaves: React.FC<IListAnalyticsLibrarySavesProps> = props => {
  const { listDetail } = props

  const [loading, toggleLoading] = useState(false)
  const [lists, setLists] = useState<IAddToLibraryTrackingInfo[]>([])

  const CACHE_KEY = `listAnalyticsLibrarySaves-${listDetail.id}`

  const fetch = async () => {
    try {
      const cacheValue = ls.get(CACHE_KEY) as IAddToLibraryTrackingInfo[] | null
      if (cacheValue) {
        setLists(cacheValue)
        return
      }

      toggleLoading(true)
      const list = await getAddToLibraryTrackingsByList(listDetail.id)
      setLists(list)
      ls.set(CACHE_KEY, list, {
        ttl: appConfig.analytics.cacheInvalidationTimeInSec,
      })
      toggleLoading(false)
    } catch (e) {
      appAnalytics.captureException(e)
      toastError('Something went wrong!')
    }
  }

  useEffect(() => {
    appAnalytics.sendEvent({
      action: AnalyticsEventType.LIST_ANALYTICS_VIEW_CLONES,
      extra: {
        listId: listDetail.id,
      },
    })
    fetch()
  }, [])

  const totalLibrarySaves = lists.length

  const renderInfo = (info: IAddToLibraryTrackingInfo) => {
    return (
      <div>
        <div className="flex items-center">
          <div className="flex-1">
            <CoreLink url={getListPageUrl(info.clonedListId)} isExternal>
              <div className="font-semibold underline">{info.clonedListName}</div>
            </CoreLink>
            <div className="text-sm text-gray-600">{getRelativeTime(new Date(info.addedAt as any).toISOString())}</div>
          </div>
        </div>
        <div className="border-b border-gray-200 my-2" />
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return <Loader type={LoaderType.ELLIPSIS} />
    }

    return (
      <div>
        <ListAnalyticsCount
          count={totalLibrarySaves}
          infoText="Whenever someone clones this list to their personal library."
        />

        <div>
          {lists.map((list, index) => {
            return <React.Fragment key={index}>{renderInfo(list)}</React.Fragment>
          })}
        </div>
      </div>
    )
  }

  return <div>{renderContent()}</div>
}

export default ListAnalyticsLibrarySaves
