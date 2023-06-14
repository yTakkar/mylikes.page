import React, { useRef, useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import Loader, { LoaderType } from '../loader/Loader'
import useOnEnter from '../../hooks/useOnEnter'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import { REGEX_MAP } from '../../constants/constants'
import classNames from 'classnames'
import CoreTextarea from '../core/CoreTextarea'
import { CheckIcon } from '@heroicons/react/solid'
import { handleValidation } from '../../utils/form'

enum FieldKeyType {
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
  VISIBILITY = 'VISIBILITY',
}

const VISIBILITY_OPTIONS = [
  {
    label: 'Public',
    value: 'PUBLIC',
    description: 'The list will be shown on your profile and be visible to anyone.',
  },
  {
    label: 'Private',
    value: 'PRIVATE',
    description: 'The list will only be visible to you.',
  },
]

interface ICreateListPopupProps {
  onClose: () => void
}

const CreateListPopup: React.FC<ICreateListPopupProps> = props => {
  const { onClose } = props

  const [fields, setFields] = useState<Record<FieldKeyType, string>>({
    NAME: '',
    DESCRIPTION: '',
    VISIBILITY: 'PUBLIC',
  })
  const [fieldsWithError, setFieldsWithError] = useState<Record<FieldKeyType, boolean>>({
    NAME: false,
    DESCRIPTION: false,
    VISIBILITY: false,
  })
  const [loading, toggleLoading] = useState(false)

  const formRef = useRef<HTMLDivElement | null>(null)

  const FIELD_VALIDATION_MAPPING = {
    [FieldKeyType.NAME]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Name',
      value: fields.NAME,
      key: FieldKeyType.NAME,
      optional: false,
    },
    [FieldKeyType.DESCRIPTION]: {
      regex: REGEX_MAP.NOT_EMPTY,
      error: 'Invalid Description',
      value: fields.DESCRIPTION,
      key: FieldKeyType.DESCRIPTION,
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
      console.log('submit')
    }

    handleValidation(FIELD_VALIDATION_MAPPING, fieldsWithError, setFieldsWithError, onSuccess)
  }

  useOnEnter(formRef, handleSubmit)

  const renderContent = () => {
    return (
      <div ref={formRef}>
        <div className="user-input-group">
          <div className="user-input-label">Name *</div>
          <CoreTextInput
            type={CoreTextInputType.TEXT}
            placeholder="Name"
            value={fields.NAME}
            setValue={updateField(FieldKeyType.NAME)}
            autoComplete="name"
            autoFocus
            inputClassName={classNames('user-input', {
              'user-input-error': fieldsWithError.NAME,
            })}
          />
        </div>

        <div className="user-input-group">
          <div className="user-input-label">Description</div>
          <CoreTextarea
            value={fields.DESCRIPTION}
            setValue={updateField(FieldKeyType.DESCRIPTION)}
            placeholder="Brief description for this list"
            className={classNames('user-input h-24', {
              'user-input-error': fieldsWithError.DESCRIPTION,
            })}
          />
        </div>

        <div className="user-input-group">
          {VISIBILITY_OPTIONS.map(option => {
            const isSelected = option.value === fields.VISIBILITY

            return (
              <div
                key={option.value}
                className={classNames(
                  'relative bg-alabaster py-2 px-4 mb-2 rounded border border-alabaster text-gray-700 cursor-pointer',
                  {
                    'border-mercury bg-whisper text-typo-title': isSelected,
                  }
                )}
                onClick={() => {
                  updateField(FieldKeyType.VISIBILITY)(option.value)
                }}>
                <div className="font-medium font-primary-medium flex items-center">
                  {option.label}
                  {isSelected && <CheckIcon className="w-5 h-5 text-brand-logo ml-1 relative top-[-1px]" />}
                </div>
                <div className="">{option.description}</div>
              </div>
            )
          })}
        </div>

        <div className="user-input-group">
          <div className="text-typo-paragraphLight text-sm">
            You can change the title and privacy settings at any time from the list settings.
          </div>
        </div>
      </div>
    )
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: onClose,
        title: 'Create a list',
        disableOutsideClick: true,
      }}
      footer={{
        buttons: [
          {
            label: 'Cancel',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_SECONDARY,
            onClick: onClose,
          },
          {
            label: 'Create List',
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_PRIMARY,
            className: 'ml-1',
            loading: loading,
            disabled: loading,
            onClick: handleSubmit,
          },
        ],
      }}>
      <div className="p-4">
        {loading ? (
          <div className="">
            <Loader type={LoaderType.ELLIPSIS} />
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </FullWidthModal>
  )
}

export default CreateListPopup
