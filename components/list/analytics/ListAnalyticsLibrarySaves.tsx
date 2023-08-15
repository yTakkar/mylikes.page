import React, { useEffect, useState } from 'react'
import { IListDetail } from '../../../interface/list'
import Loader, { LoaderType } from '../../loader/Loader'
import { getListPageUrl } from '../../../utils/routes'
import { PresentationChartLineIcon } from '@heroicons/react/outline'
import { getAddToLibraryTrackingsByList } from '../../../firebase/store/addToLibraryTracking'
import { IAddToLibraryTrackingInfo } from '../../../interface/addToLibraryTracking'
import { getRelativeTime } from '../../../utils/date'
import CoreLink from '../../core/CoreLink'
import appConfig from '../../../config/appConfig'
import ls from 'localstorage-slim'

interface IListAnalyticsLibrarySavesProps {
  listDetail: IListDetail
}

const ListAnalyticsLibrarySaves: React.FC<IListAnalyticsLibrarySavesProps> = props => {
  const { listDetail } = props

  const [loading, toggleLoading] = useState(false)
  const [lists, setLists] = useState<IAddToLibraryTrackingInfo[]>([])

  const CACHE_KEY = `listAnalyticsLibrarySaves-${listDetail.id}`

  const fetch = async () => {
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
  }

  useEffect(() => {
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
        <div className="inline-flex mb-6">
          <span className="mt-[2px] mr-1">
            <PresentationChartLineIcon className="w-5" />
          </span>
          <span>
            Whenever someone clones this list to their personal library. Updates every{' '}
            {appConfig.analytics.cacheInvalidationTimeInSec / 60} minutes.
          </span>
        </div>

        <div className="flex items-center flex-col mb-6">
          <div className="font-bold">Overall count</div>
          <div className="text-xl">{totalLibrarySaves}</div>
        </div>

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
