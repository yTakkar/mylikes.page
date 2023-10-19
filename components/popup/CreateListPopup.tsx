import React, { useContext, useEffect, useRef, useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import CoreTextInput, { CoreTextInputType } from '../core/CoreInput'
import { REGEX_MAP } from '../../constants/constants'
import classNames from 'classnames'
import CoreTextarea from '../core/CoreTextarea'
import { CheckIcon } from '@heroicons/react/solid'
import { handleValidation } from '../../utils/form'
import { addList, deleteListById, updateList } from '../../firebase/store/list'
import ApplicationContext from '../ApplicationContext'
import { IListDetail, ListVisibilityType } from '../../interface/list'
import { toastError, toastSuccess } from '../Toaster'
import { generateListId } from '../../utils/list'
import { vibrate } from '../../utils/common'
import { useRouter } from 'next/router'
import { getListPageUrl, getProfilePageUrl } from '../../utils/routes'
import Alert from '../modal/Alert'
import { revalidateUrls } from '../../utils/revalidate'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'

enum FieldKeyType {
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
  VISIBILITY = 'VISIBILITY',
}

const VISIBILITY_OPTIONS = [
  {
    label: 'Public',
    value: ListVisibilityType.PUBLIC,
    description: 'The list will be shown on your profile and be visible to anyone.',
  },
  {
    label: 'Private',
    value: ListVisibilityType.PRIVATE,
    description: 'The list will only be visible to you.',
  },
]

interface ICreateListPopupProps {
  listDetail?: IListDetail
  onClose: () => void
  onSuccess?: (name: string, description: string, visibility: ListVisibilityType) => void
}

const CreateListPopup: React.FC<ICreateListPopupProps> = props => {
  const { listDetail, onClose, onSuccess } = props

  const applicationContext = useContext(ApplicationContext)
  const { user } = applicationContext

  const isEditable = !!listDetail

  const router = useRouter()

  const [fields, setFields] = useState<Record<FieldKeyType, string>>({
    NAME: '',
    DESCRIPTION: '',
    VISIBILITY: ListVisibilityType.PUBLIC,
  })
  const [fieldsWithError, setFieldsWithError] = useState<Record<FieldKeyType, boolean>>({
    NAME: false,
    DESCRIPTION: false,
    VISIBILITY: false,
  })
  const [loading, toggleLoading] = useState(false)

  const [showDeleteAlert, toggleDeleteAlert] = useState(false)
  const [deleteLoading, toggleDeleteLoading] = useState(false)

  useEffect(() => {
    if (listDetail) {
      setFields({
        [FieldKeyType.NAME]: listDetail.name || '',
        [FieldKeyType.DESCRIPTION]: listDetail.description || '',
        [FieldKeyType.VISIBILITY]: listDetail.visibility || ListVisibilityType.PUBLIC,
      })
    }
  }, [listDetail])

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

  const handleUpdate = async () => {
    await updateList(listDetail!.id, {
      name: fields.NAME,
      description: fields.DESCRIPTION,
      visibility: fields.VISIBILITY as ListVisibilityType,
    })
    await revalidateUrls([getProfilePageUrl(user!.username), getListPageUrl(listDetail!.id)])
    if (listDetail?.visibility !== fields.VISIBILITY) {
      appAnalytics.sendEvent({
        action: AnalyticsEventType.LIST_UPDATE_VISIBILITY,
        extra: {
          visibility: fields.VISIBILITY,
        },
      })
    }
    appAnalytics.sendEvent({
      action: AnalyticsEventType.LIST_UPDATE,
      extra: {
        id: listDetail!.id,
        name: fields.NAME,
        description: fields.DESCRIPTION,
        visibility: fields.VISIBILITY,
      },
    })
    toastSuccess('List settings updated!')
  }

  const handleAdd = async () => {
    const id = generateListId(fields.NAME)
    const createdAt = new Date().getTime()
    await addList({
      id,
      name: fields.NAME,
      description: fields.DESCRIPTION,
      visibility: fields.VISIBILITY as ListVisibilityType,
      createdAt,
      ownerEmail: user!.email,
      recommendations: [],
      clonedListId: null,
    })
    await revalidateUrls([getProfilePageUrl(user!.username)])
    appAnalytics.sendEvent({
      action: AnalyticsEventType.LIST_CREATE,
      extra: {
        id,
        name: fields.NAME,
        description: fields.DESCRIPTION,
        ownerEmail: user!.email,
        createdAt,
      },
    })
    toastSuccess('List created!')
    vibrate()
    router.push(getListPageUrl(id))
  }

  const handleOnSuccess = () => {
    if (onSuccess) {
      onSuccess(fields.NAME, fields.DESCRIPTION, fields.VISIBILITY as ListVisibilityType)
    }
  }

  const handleSubmit = () => {
    if (loading) {
      return null
    }

    const onSuccess = async () => {
      toggleLoading(true)
      try {
        if (isEditable) {
          await handleUpdate()
        } else {
          await handleAdd()
        }
        onClose()
        handleOnSuccess()
      } catch (e) {
        console.error('list:add:error', e)
        appAnalytics.captureException(e)
        toastError('Failed to create list')
      } finally {
        toggleLoading(false)
      }
    }

    handleValidation(FIELD_VALIDATION_MAPPING, fieldsWithError, setFieldsWithError, onSuccess)
  }

  const handleDelete = async () => {
    if (deleteLoading) {
      return null
    }

    toggleDeleteLoading(true)
    try {
      await deleteListById(listDetail!.id)
      await revalidateUrls([getProfilePageUrl(listDetail!.owner!.username)])
      toastSuccess('List deleted!')
      appAnalytics.sendEvent({
        action: AnalyticsEventType.LIST_DELETE,
        extra: {
          id: listDetail!.id,
          name: listDetail!.name,
          ownerEmail: user!.email,
        },
      })
      router.push(getProfilePageUrl(user!.username))
      onClose()
    } catch (e) {
      appAnalytics.captureException(e)
      console.error('list:delete:error', e)
      toastError('Failed to delete list')
    }
    toggleDeleteLoading(false)
  }

  return (
    <>
      <FullWidthModal
        modal={{
          dismissModal: onClose,
          title: isEditable ? 'List settings' : 'Create a list',
          disableOutsideClick: true,
        }}
        footer={{
          buttons: [
            ...(isEditable
              ? [
                  {
                    label: 'Delete List',
                    size: CoreButtonSize.MEDIUM,
                    type: CoreButtonType.OUTLINE_SECONDARY,
                    onClick: () => {
                      toggleDeleteAlert(true)
                    },
                  },
                ]
              : []),
            {
              label: 'Cancel',
              size: CoreButtonSize.MEDIUM,
              type: CoreButtonType.SOLID_SECONDARY,
              onClick: onClose,
              className: 'ml-1',
            },
            {
              label: isEditable ? 'Save' : 'Create List',
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
          <div ref={formRef}>
            <div className="user-input-group">
              <div className="user-input-label">Title *</div>
              <CoreTextInput
                type={CoreTextInputType.TEXT}
                placeholder="Eg. My favorite movies"
                value={fields.NAME}
                setValue={updateField(FieldKeyType.NAME)}
                autoComplete="name"
                autoFocus
                inputClassName={classNames('user-input', {
                  'user-input-error': fieldsWithError.NAME,
                })}
                sanitizeOnBlur
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
                sanitizeOnBlur
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
                    <div className="font-bold flex items-center">
                      {option.label}
                      {isSelected && <CheckIcon className="w-5 h-5 text-brand-logo ml-1 relative top-[-1px]" />}
                    </div>
                    <div className="">{option.description}</div>
                  </div>
                )
              })}
            </div>

            {!isEditable && (
              <div className="user-input-group">
                <div className="text-typo-paragraphLight text-sm">
                  You can change the title and privacy settings at any time from the list settings.
                </div>
              </div>
            )}
          </div>
        </div>
      </FullWidthModal>

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
    </>
  )
}

export default CreateListPopup
