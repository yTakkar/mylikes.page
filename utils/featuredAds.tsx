import React from 'react'
import RecommendationInfo, {
  RecommendationInfoLayoutType,
  RecommendationInfoSourceType,
} from '../components/recommendation/RecommendationInfo'
import { IListDetail, IListRecommendationInfo } from '../interface/list'
import { IArrayPositionItemsConfig, shuffle } from './array'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'
import appConfig from '../config/appConfig'
import ListInfo from '../components/list/ListInfo'

export const getFeaturedRecommendations = (lists: IListDetail[]): IListRecommendationInfo[] => {
  const recommendations = lists.reduce((acc, list) => {
    const listRecommendations: IListRecommendationInfo[] = list.recommendations.map(recommendation => ({
      ...recommendation,
      __sponsoredMeta: {
        list: list,
      },
    }))
    return [...acc, ...listRecommendations]
  }, [] as IListRecommendationInfo[])
  return shuffle(recommendations)
}

const _renderSponsoredRecommendation = (recommendationInfo: IListRecommendationInfo) => {
  const onLinkClick = (listRecommendation: IListRecommendationInfo) => {
    appAnalytics.sendEvent({
      action: AnalyticsEventType.RECOMMENDATION_VISIT,
      extra: {
        listId: listRecommendation.__sponsoredMeta?.list.id,
        recommendationId: listRecommendation.id,
        url: listRecommendation.url,
        title: listRecommendation.title,
        type: listRecommendation.type,
      },
    })
  }

  return (
    <RecommendationInfo
      key={`${recommendationInfo.id}-${recommendationInfo.addedAt}`}
      layout={RecommendationInfoLayoutType.INLINE}
      source={RecommendationInfoSourceType.LIST}
      recommendationInfo={recommendationInfo}
      recommendationOwner={recommendationInfo.__sponsoredMeta?.list.owner || undefined}
      list={recommendationInfo.__sponsoredMeta?.list || undefined}
      sponsored
      onLinkClick={() => onLinkClick(recommendationInfo)}
    />
  )
}

export const getFeaturedRecommendationPositions = (
  list: IListDetail,
  featuredLists: IListDetail[]
): IArrayPositionItemsConfig => {
  const index = appConfig.ads.featured.recommendationsFrequency
  let positions: IArrayPositionItemsConfig = {}

  const listRecommendations = list.recommendations
  const featuredRecommendations = getFeaturedRecommendations(featuredLists)

  if (featuredRecommendations.length) {
    if (listRecommendations.length < index) {
      positions = {
        '-1': _renderSponsoredRecommendation(featuredRecommendations[0]),
      }
    } else if (listRecommendations.length >= index) {
      Array.from({ length: listRecommendations.length }).forEach((_, i) => {
        const position = i % index
        if (position === 0 && i !== 0) {
          const recommendationInfo = featuredRecommendations.shift()!
          positions[i] = _renderSponsoredRecommendation(recommendationInfo)
        }
      })
    }
  }

  return positions
}

const _renderSponsoredList = (list: IListDetail) => {
  return <ListInfo key={list.id} list={list} sponsored />
}

export const getFeaturedListPositions = (
  lists: IListDetail[],
  _featuredLists: IListDetail[]
): IArrayPositionItemsConfig => {
  const index = appConfig.ads.featured.listsFrequency
  let positions: IArrayPositionItemsConfig = {}

  const featuredLists = shuffle(_featuredLists)

  if (featuredLists.length) {
    if (lists.length < index) {
      positions = {
        '-1': _renderSponsoredList(featuredLists[0]),
      }
    } else if (lists.length >= index) {
      Array.from({ length: lists.length }).forEach((_, i) => {
        const position = i % index
        if (position === 0 && i !== 0) {
          const listInfo = featuredLists.shift()!
          positions[i] = _renderSponsoredList(listInfo)
        }
      })
    }
  }

  return positions
}
