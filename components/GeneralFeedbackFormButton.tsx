import React from 'react'
import CoreLink from './core/CoreLink'
import appConfig from '../config/appConfig'
import appAnalytics from '../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../constants/analytics'

function GeneralFeedbackFormButton() {
  return (
    <CoreLink
      isExternal
      url={appConfig.feedback.generalFeedbackForm}
      className="feedbackFormButton"
      onClick={() => {
        appAnalytics.sendEvent({
          action: AnalyticsEventType.FEEDBACK,
        })
      }}>
      <div>Feedback</div>
    </CoreLink>
  )
}

export default GeneralFeedbackFormButton
