import React, { useRef, useState } from 'react'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import classNames from 'classnames'
import CoreSelectInput, { ICoreSelectInputOption } from '../core/CoreSelectInput'
import { RECOMMENDATION_TYPE_LABEL_MAP, REGEX_MAP } from '../../constants/constants'
import CoreTextarea from '../core/CoreTextarea'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { CheckIcon } from '@heroicons/react/outline'
import useOnEnter from '../../hooks/useOnEnter'
import { handleValidation } from '../../utils/form'

enum FieldKeyType {
  URL = 'URL',
  TITLE = 'TITLE',
  TYPE = 'TYPE',
  NOTES = 'NOTES',
}

interface IAddRecommendationFormProps {}

const AddRecommendationForm: React.FC<IAddRecommendationFormProps> = props => {
  const defaultFields = Object.keys(FieldKeyType).reduce((acc: any, key: any) => {
    acc[key] = ''
    return acc
  }, {})

  const defaultFieldsWithError = Object.keys(FieldKeyType).reduce((acc: any, key: any) => {
    acc[key] = false
    return acc
  }, {})

  const [fields, setFields] = useState<Record<FieldKeyType, string>>(defaultFields)
  const [fieldsWithError, setFieldsWithError] = useState<Record<FieldKeyType, boolean>>(defaultFieldsWithError)
  const [loading, toggleLoading] = useState(false)

  const formRef = useRef<HTMLDivElement | null>(null)

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

  const updateField = (field: keyof typeof fields) => (value: string) => {
    setFields({
      ...fields,
      [field]: value,
    })
  }

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const onSuccess = async () => {
      console.log('on success')
    }

    handleValidation(FIELD_VALIDATION_MAPPING, fieldsWithError, setFieldsWithError, onSuccess)
  }

  useOnEnter(formRef, handleSubmit)

  const typeOptions: ICoreSelectInputOption[] = Object.entries(RECOMMENDATION_TYPE_LABEL_MAP).map(([key, value]) => ({
    id: key,
    value: key,
    label: value,
    selected: false,
  }))

  return (
    <div ref={formRef}>
      <div className="user-input-group">
        <div className="text-typo-paragraphLight text-sm">
          You can edit the recommendation at any time from the settings page.
        </div>
      </div>

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
        />
      </div>

      <div className="user-input-group ">
        <div className="user-input-label">Type *</div>
        <CoreSelectInput
          value={fields.TYPE}
          onChange={updateField(FieldKeyType.TYPE)}
          options={typeOptions}
          className={classNames({
            'user-input-error': fieldsWithError.TYPE,
          })}
        />
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
      </div>
    </div>
  )
}

export default AddRecommendationForm
