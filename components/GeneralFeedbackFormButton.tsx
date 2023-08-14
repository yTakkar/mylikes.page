import React from 'react'
import CoreLink from './core/CoreLink'
import appConfig from '../config/appConfig'

function GeneralFeedbackFormButton() {
  return (
    <CoreLink isExternal url={appConfig.feedback.generalFeedbackForm} className="feedbackFormButton">
      <div>Feedback</div>
    </CoreLink>
  )
}

export default GeneralFeedbackFormButton
