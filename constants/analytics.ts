export enum AnalyticsCategoryType {
  NONE = '',
}

export enum AnalyticsEventType {
  // error
  EXCEPTION = 'exception',

  // auth
  SIGNUP = 'signup',
  LOGIN = 'login',
  LOGOUT = 'logout',

  // update profile
  EDIT_PROFILE = 'edit_profile',
  EDIT_PROFILE_AVATAR = 'edit_profile_avatar',
  EDIT_PROFILE_USERNAME = 'edit_profile_username',

  // list
  LIST_CREATE = 'list_create',
  LIST_DELETE = 'list_delete',
  LIST_UPDATE = 'list_update',
  LIST_UPDATE_VISIBILITY = 'list_update_visibility',
  LIST_SHARE = 'list_share',
  LIST_COPY_URL = 'list_copy_url',

  // list clone
  LIST_CLONE = 'list_clone',
  LIST_CLONED_VIEW_ORIGINAL = 'list_cloned_view_original',

  // list analytics
  LIST_ANALYTICS_VIEW_RECOMMENDATIONS_VISIT = 'list_analytics_view_recommendations_visit',
  LIST_ANALYTICS_VIEW_CLONES = 'list_analytics_view_clones',
  LIST_ANALYTICS_VIEW_ADD_TO_LIST = 'list_analytics_view_add_to_list',

  // list recommendation
  RECOMMENDATION_ADD = 'recommendation_add',
  RECOMMENDATION_ADD_FROM_LIST = 'recommendation_add_from_list',
  RECOMMENDATION_REMOVE = 'recommendation_remove',
  RECOMMENDATION_ADD_TO_LIST = 'recommendation_add_to_list',
  RECOMMENDATION_ADD_UPDATE_NOTE = 'recommendation_add_update_note',
  RECOMMENDATION_VISIT = 'recommendation_visit',

  // saved recommendation
  SAVED_RECOMMENDATION_ADD = 'saved_recommendation_add',
  SAVED_RECOMMENDATION_REMOVE = 'saved_recommendation_remove',
  SAVED_RECOMMENDATION_SUGGEST_TYPE = 'saved_recommendation_suggest_type',

  // featured shelf list
  FEATURED_SHELF_LIST_VISIT = 'featured_shelf_list_visit',

  // shelf
  SHELF_LIST_VISIT = 'shelf_list_visit',

  // custom lists,
  MOST_POPULAR_RECOMMENDATION_VISIT = 'most_popular_recommendation_visit',

  // ads
  AD_FEATURED_LIST_VISIT = 'ad_featured_list_visit',
  AD_FEATURED_RECOMMENDATION_VISIT = 'ad_featured_recommendation_visit',
  AD_FEATURED_RECOMMENDATION_TEXT_LINK_VISIT = 'ad_featured_recommendation_text_link_visit',
  AD_RECOMMENDATION_TEXT_LINK_VISIT = 'ad_recommendation_text_link_visit',

  // pwa
  PWA_INSTALL_SUCCESS = 'pwa_install_success',
  PWA_INSTALL_FAILED = 'pwa_install_failed',

  // general
  FEEDBACK = 'feedback',
}
