import { useContext, useEffect, useState } from 'react'
import { IShelfDetail } from '../interface/shelf'
import ls from 'localstorage-slim'
import { getShelfById } from '../firebase/store/shelf'
import appConfig from '../config/appConfig'
import appAnalytics from '../lib/analytics/appAnalytics'
import ApplicationContext from '../components/ApplicationContext'

function useFeaturedAds() {
  const applicationContext = useContext(ApplicationContext)
  const {
    methods: { dispatch },
  } = applicationContext

  const [shelf, setShelf] = useState<IShelfDetail | null>(null)

  const CACHE_KEY = `FEATURED-ADS-SHELF`

  const fetchShelf = async () => {
    try {
      const cacheValue = ls.get(CACHE_KEY) as IShelfDetail | null
      if (cacheValue) {
        setShelf(cacheValue)
        return
      }

      const list = await getShelfById('featured-lists', {})
      if (list) {
        setShelf(list)
        ls.set(CACHE_KEY, list, {
          ttl: appConfig.featured.listsRevalidateTimeInSec,
        })
      }
    } catch (e) {
      console.error('Error fetching featured lists', e)
      appAnalytics.captureException(e)
    }
  }

  useEffect(() => {
    fetchShelf()
  }, [])

  useEffect(() => {
    if (shelf) {
      dispatch({
        type: 'UPDATE_ADS_SHELF',
        payload: {
          shelf,
        },
      })
    }
  }, [shelf])
}

export default useFeaturedAds
