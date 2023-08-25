import React, { useContext, useEffect, useRef, useState } from 'react'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import classNames from 'classnames'
import CoreSelectInput, { ICoreSelectInputOption } from '../core/CoreSelectInput'
import { RECOMMENDATION_TYPE_LABEL_MAP, REGEX_MAP } from '../../constants/constants'
import CoreTextarea from '../core/CoreTextarea'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { CheckIcon, TrashIcon } from '@heroicons/react/outline'
import { handleValidation } from '../../utils/form'
import CoreCheckbox from '../core/CoreCheckbox'
import {
  addSavedRecommendation,
  deleteSavedRecommendationById,
  updateSavedRecommendation,
} from '../../firebase/store/saved-recommendations'
import { nanoid } from 'nanoid'
import ApplicationContext from '../ApplicationContext'
import { toastError, toastSuccess } from '../Toaster'
import { generateRecommendationImageUrl } from '../../utils/recommendation'
import { IRecommendationInfo } from '../../interface/recommendation'
import Alert from '../modal/Alert'
import CoreLink from '../core/CoreLink'
import appConfig from '../../config/appConfig'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'

enum FieldKeyType {
  URL = 'URL',
  TITLE = 'TITLE',
  TYPE = 'TYPE',
  NOTES = 'NOTES',
  IS_ADULT = 'IS_ADULT',
}

interface IAddRecommendationFormProps {
  recommendation?: IRecommendationInfo
  onSuccess?: () => void
}

const AddRecommendationForm: React.FC<IAddRecommendationFormProps> = props => {
  const { recommendation, onSuccess } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  const defaultFieldsWithError = Object.keys(FieldKeyType).reduce((acc: any, key: any) => {
    acc[key] = false
    return acc
  }, {})

  const [fields, setFields] = useState<Record<FieldKeyType, any>>({
    URL: '',
    TITLE: '',
    TYPE: '',
    NOTES: '',
    IS_ADULT: false,
  })
  const [fieldsWithError, setFieldsWithError] = useState<Record<FieldKeyType, boolean>>(defaultFieldsWithError)
  const [loading, toggleLoading] = useState(false)

  const [showDeleteAlert, toggleDeleteAlert] = useState(false)
  const [deleteLoading, toggleDeleteLoading] = useState(false)

  const formRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (recommendation) {
      setFields({
        [FieldKeyType.URL]: recommendation.url,
        [FieldKeyType.TITLE]: recommendation.title,
        [FieldKeyType.TYPE]: recommendation.type,
        [FieldKeyType.NOTES]: recommendation.notes,
        [FieldKeyType.IS_ADULT]: recommendation.isAdult,
      })
    }
  }, [recommendation])

  const FIELD_VALIDATION_MAPPING = {
    [FieldKeyType.URL]: {
      regex: REGEX_MAP.URL,
      error: 'Invalid URL',
      value: fields.URL,
      key: FieldKeyType.URL,
      optional: false,
    },
    [FieldKeyType.TITLE]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Title',
      value: fields.TITLE,
      key: FieldKeyType.TITLE,
      optional: false,
    },
    [FieldKeyType.TYPE]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Type',
      value: fields.TYPE,
      key: FieldKeyType.TYPE,
      optional: false,
    },
    [FieldKeyType.NOTES]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Note',
      value: fields.NOTES,
      key: FieldKeyType.NOTES,
      optional: true,
    },
  }

  const isEditable = !!recommendation

  const updateField = (field: keyof typeof fields) => (value: string) => {
    setFields({
      ...fields,
      [field]: value,
    })
  }

  const handleAdd = async () => {
    const url = fields.URL
    const imageUrl = generateRecommendationImageUrl(url)
    const createdAt = new Date().getTime()
    await addSavedRecommendation({
      id: nanoid(),
      url,
      title: fields.TITLE,
      imageUrl,
      isAdult: fields.IS_ADULT,
      createdAt,
      notes: fields.NOTES,
      type: fields.TYPE,
      ownerEmail: user!.email,
    })
    appAnalytics.sendEvent({
      action: AnalyticsEventType.SAVED_RECOMMENDATION_ADD,
      extra: {
        url,
        title: fields.TITLE,
        type: fields.TYPE,
        ownerEmail: user!.email,
        isAdult: fields.IS_ADULT,
        imageUrl,
        createdAt,
      },
    })
    onSuccess?.()
    toastSuccess('Recommendation is saved!')
  }

  const handleUpdate = async () => {
    const url = fields.URL
    await updateSavedRecommendation(recommendation!.id, {
      url,
      title: fields.TITLE,
      imageUrl: generateRecommendationImageUrl(url),
      isAdult: fields.IS_ADULT,
      notes: fields.NOTES,
      type: fields.TYPE,
    })
    onSuccess?.()
    toastSuccess('Updated!')
  }

  const handleDelete = async () => {
    if (deleteLoading) {
      return null
    }

    toggleDeleteLoading(true)
    try {
      await deleteSavedRecommendationById(recommendation!.id)
      toastSuccess('Recommendation deleted!')
      appAnalytics.sendEvent({
        action: AnalyticsEventType.SAVED_RECOMMENDATION_REMOVE,
        extra: {
          id: recommendation!.id,
          url: recommendation!.url,
          type: recommendation!.type,
          ownerEmail: user!.email,
        },
      })
      onSuccess?.()
    } catch (e) {
      appAnalytics.captureException(e)
      console.error('list:delete:error', e)
      toastError('Failed to delete recommendation!')
    }
    toggleDeleteLoading(false)
  }

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const onValidationSuccess = async () => {
      toggleLoading(true)
      try {
        if (isEditable) {
          await handleUpdate()
        } else {
          await handleAdd()
        }
      } catch (e) {
        appAnalytics.captureException(e)
        console.error('recommendation:add:error', e)
        toastError('Something went wrong')
      } finally {
        toggleLoading(false)
      }
    }

    handleValidation(FIELD_VALIDATION_MAPPING, fieldsWithError, setFieldsWithError, onValidationSuccess)
  }

  const typeOptions: ICoreSelectInputOption[] = Object.entries(RECOMMENDATION_TYPE_LABEL_MAP).map(([key, value]) => ({
    id: key,
    value: key,
    label: value,
    selected: false,
  }))

  return (
    <div>
      <div ref={formRef}>
        {/* <div className="user-input-group">
        <div className="text-typo-paragraphLight text-sm">
          You can edit the recommendation at any time from the settings page.
        </div>
      </div> */}

        <div className="user-input-group">
          <div className="user-input-label">URL *</div>
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Eg. amazon.com/product/1234"
            value={fields.URL}
            setValue={updateField(FieldKeyType.URL)}
            autoComplete="url"
            autoFocus
            inputClassName={classNames('user-input', {
              'user-input-error': fieldsWithError.URL,
            })}
            sanitizeOnBlur
          />
        </div>

        <div className="user-input-group">
          <div className="user-input-label">Title *</div>
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Eg. An old-school shirt I really like"
            value={fields.TITLE}
            setValue={updateField(FieldKeyType.TITLE)}
            inputClassName={classNames('user-input', {
              'user-input-error': fieldsWithError.TITLE,
            })}
            sanitizeOnBlur
          />
        </div>

        <div className="user-input-group ">
          <div className="user-input-label">Type *</div>
          <div className="text-typo-paragraphLight text-sm mb-2 -mt-1">What kind of recommendation is this?</div>
          <CoreSelectInput
            value={fields.TYPE}
            onChange={updateField(FieldKeyType.TYPE)}
            options={typeOptions}
            className={classNames({
              'user-input-error': fieldsWithError.TYPE,
            })}
          />
          <div className="text-typo-paragraphLight text-sm mt-2">
            {`Don't see the type you want? `}
            <CoreLink
              isExternal
              url={appConfig.feedback.newRecommendationTypeForm}
              className="underline"
              onClick={() => {
                appAnalytics.sendEvent({
                  action: AnalyticsEventType.SAVED_RECOMMENDATION_SUGGEST_TYPE,
                })
              }}>
              Suggest here
            </CoreLink>
          </div>
        </div>

        <div className="user-input-group">
          <div className="user-input-label">Notes</div>
          <CoreTextarea
            value={fields.NOTES}
            setValue={updateField(FieldKeyType.NOTES)}
            placeholder="A note/review you want to attach"
            className={classNames('user-input h-24', {
              'user-input-error': fieldsWithError.NOTES,
            })}
            sanitizeOnBlur
          />
        </div>

        <div className="user-input-group">
          <CoreCheckbox
            id="primary"
            onChange={updateField(FieldKeyType.IS_ADULT) as any}
            checked={fields.IS_ADULT}
            label="Does this recommendation contain adult content?"
          />
        </div>

        <div className="user-input-group">
          <CoreButton
            label="Save Details"
            size={CoreButtonSize.MEDIUM}
            type={CoreButtonType.SOLID_PRIMARY}
            loading={loading}
            icon={CheckIcon}
            onClick={handleSubmit}
          />
          {isEditable && (
            <CoreButton
              label="Delete"
              size={CoreButtonSize.MEDIUM}
              type={CoreButtonType.OUTLINE_SECONDARY}
              onClick={() => {
                toggleDeleteAlert(true)
              }}
              icon={TrashIcon}
              className="ml-1"
            />
          )}
        </div>
      </div>

      {showDeleteAlert ? (
        <Alert
          dismissModal={() => toggleDeleteAlert(false)}
          title="Delete Confirmation"
          subTitle="Are you sure you want to do this? You cannot undo this."
          cta={{
            primary: {
              show: true,
              label: 'Delete',
              loading: deleteLoading,
              onClick: handleDelete,
            },
            secondary: {
              show: true,
              label: 'Cancel',
              onClick: () => toggleDeleteAlert(false),
            },
          }}
        />
      ) : null}
    </div>
  )
}

export default AddRecommendationForm
