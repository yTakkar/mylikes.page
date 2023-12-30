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
import { IUserInfo } from '../interface/user'
import TextLinkAd from '../components/ads/TextLinkAd'

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

const _renderTextLinkAd = (sourceList: IListDetail) => {
  const onLinkClick = () => {
    appAnalytics.sendEvent({
      action: AnalyticsEventType.AD_FEATURED_RECOMMENDATION_TEXT_LINK_VISIT,
      extra: {
        listId: sourceList.id,
      },
    })
  }

  return (
    <div>
      <TextLinkAd onLinkClick={onLinkClick} />
      <div className="w-full h-[1px] bg-gallery" />
    </div>
  )
}

const _renderSponsoredRecommendation = (recommendationInfo: IListRecommendationInfo, sourceList: IListDetail) => {
  const onLinkClick = (listRecommendation: IListRecommendationInfo) => {
    appAnalytics.sendEvent({
      action: AnalyticsEventType.RECOMMENDATION_VISIT,
      extra: {
        listId: listRecommendation.__sponsoredMeta?.list?.id,
        recommendationId: listRecommendation.id,
        url: listRecommendation.url,
        title: listRecommendation.title,
        type: listRecommendation.type,
      },
    })
    appAnalytics.sendEvent({
      action: AnalyticsEventType.AD_FEATURED_RECOMMENDATION_VISIT,
      extra: {
        recommendationId: listRecommendation.id,
        listId: listRecommendation.__sponsoredMeta?.list?.id,
        listName: listRecommendation.__sponsoredMeta?.list?.name,
        url: listRecommendation.url,
        title: listRecommendation.title,
        type: listRecommendation.type,
        sourceListId: sourceList.id,
        sourceListName: sourceList.name,
      },
    })
  }

  return (
    <div key={`${recommendationInfo.id}-${recommendationInfo.addedAt}`}>
      <RecommendationInfo
        layout={RecommendationInfoLayoutType.INLINE}
        source={RecommendationInfoSourceType.LIST}
        recommendationInfo={recommendationInfo}
        recommendationOwner={recommendationInfo.__sponsoredMeta?.list?.owner || undefined}
        list={recommendationInfo.__sponsoredMeta?.list || undefined}
        sponsored
        onLinkClick={() => onLinkClick(recommendationInfo)}
        showListName
      />
      <div className="w-full h-[1px] bg-gallery" />
    </div>
  )
}

export const getFeaturedRecommendationPositions = (
  list: IListDetail,
  _featuredLists: IListDetail[]
): IArrayPositionItemsConfig => {
  const index = appConfig.featured.recommendationsFrequency
  let positions: IArrayPositionItemsConfig = {}

  const featuredLists = shuffle(_featuredLists.filter(featuredList => featuredList.id !== list.id).filter(Boolean))

  const listRecommendations = list.recommendations
  const initialFeaturedRecommendations = getFeaturedRecommendations(featuredLists)

  let featuredRecommendations = initialFeaturedRecommendations

  if (initialFeaturedRecommendations.length) {
    if (initialFeaturedRecommendations.length < listRecommendations.length) {
      const shortage = Math.ceil(
        (listRecommendations.length - initialFeaturedRecommendations.length) / initialFeaturedRecommendations.length
      )
      const featuredRecommendationsToFill = new Array(shortage).fill(initialFeaturedRecommendations).flat()
      featuredRecommendations = [...initialFeaturedRecommendations, ...featuredRecommendationsToFill]
    }
  }

  if (featuredRecommendations.length) {
    if (listRecommendations.length <= index) {
      positions = {
        '-1': _renderSponsoredRecommendation(featuredRecommendations[0], list),
      }
    } else if (listRecommendations.length >= index) {
      Array.from({ length: listRecommendations.length }).forEach((_, i) => {
        const position = i % index
        if (position === 0 && i !== 0) {
          const recommendationInfo = featuredRecommendations.shift()!
          if (recommendationInfo) {
            positions[i] = _renderSponsoredRecommendation(recommendationInfo, list)
          }
        }
      })
    }
  }

  // if (listRecommendations.length < 10) {
  //   positions[-1] = [positions[-1], <FeaturedListsWidget />]
  // } else {
  //   positions[Math.floor(listRecommendations.length / 2)] = <FeaturedListsWidget />
  // }

  return positions
}

export const getTextLinkAdPositions = (list: IListDetail): IArrayPositionItemsConfig => {
  const index = appConfig.featured.recommendationsFrequency
  let positions: IArrayPositionItemsConfig = {}

  const listRecommendations = list.recommendations

  if (listRecommendations.length <= index) {
    positions = {
      '-1': _renderTextLinkAd(list),
    }
  } else if (listRecommendations.length >= index) {
    Array.from({ length: listRecommendations.length }).forEach((_, i) => {
      const position = i % index
      if (position === 0 && i !== 0) {
        positions[i] = _renderTextLinkAd(list)
      }
    })
  }

  return positions
}

const _renderSponsoredList = (list: IListDetail, profileInfo: IUserInfo) => {
  return (
    <ListInfo
      key={list.id}
      list={list}
      sponsored
      onClick={() => {
        appAnalytics.sendEvent({
          action: AnalyticsEventType.AD_FEATURED_LIST_VISIT,
          extra: {
            listId: list.id,
            listName: list.name,
            sourceUserEmail: profileInfo.email,
            sourceUsername: profileInfo.username,
          },
        })
      }}
    />
  )
}

export const getFeaturedListPositions = (
  profileInfo: IUserInfo,
  lists: IListDetail[],
  _featuredLists: IListDetail[]
): IArrayPositionItemsConfig => {
  const index = appConfig.featured.listsFrequency
  let positions: IArrayPositionItemsConfig = {}

  const initialFeaturedLists = shuffle(
    _featuredLists
      .filter(featuredList => {
        return !lists.some(list => list.id === featuredList.id)
      })
      .filter(Boolean)
  )

  let featuredLists = initialFeaturedLists

  if (initialFeaturedLists.length) {
    if (initialFeaturedLists.length < lists.length) {
      const shortage = Math.ceil((lists.length - initialFeaturedLists.length) / initialFeaturedLists.length)
      const featuredListsToFill = new Array(shortage).fill(initialFeaturedLists).flat()
      featuredLists = [...initialFeaturedLists, ...featuredListsToFill]
    }
  }

  if (featuredLists.length) {
    if (lists.length <= index) {
      positions = {
        '-1': _renderSponsoredList(featuredLists[0], profileInfo),
      }
    } else if (lists.length >= index) {
      Array.from({ length: lists.length }).forEach((_, i) => {
        const position = i % index
        if (position === 0 && i !== 0) {
          const listInfo = featuredLists.shift()!
          if (listInfo) {
            positions[i] = _renderSponsoredList(listInfo, profileInfo)
          }
        }
      })
    }
  }

  return positions
}
