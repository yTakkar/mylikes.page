import React, { useEffect, useState } from 'react'
import CoreTextarea from '../core/CoreTextarea'
import classNames from 'classnames'
import CoreButton, { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import { IListDetail } from '../../interface/list'
import { IRecommendationInfo } from '../../interface/recommendation'
import { updateList } from '../../firebase/store/list'
import { toastError, toastSuccess } from '../Toaster'
import { revalidateUrls } from '../../utils/revalidate'
import { getListPageUrl } from '../../utils/routes'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { AnalyticsEventType } from '../../constants/analytics'

interface IAddRecommendationNoteProps {
  list: IListDetail
  recommendationInfo: IRecommendationInfo
  note: string
  onSuccess: (value: string) => void
  onCancel: () => void
}

const AddRecommendationNote: React.FC<IAddRecommendationNoteProps> = props => {
  const { list, recommendationInfo, note, onSuccess, onCancel } = props

  const [noteValue, setNoteValue] = useState('')
  const [addNoteLoading, setAddNoteLoading] = useState(false)

  useEffect(() => {
    setNoteValue(note || '')
  }, [note])

  const handleNoteUpdate = () => {
    if (addNoteLoading) {
      return
    }

    const processCommands = async () => {
      const recommendations = list!.recommendations.map(rec => {
        if (rec.id === recommendationInfo.id) {
          return {
            ...rec,
            notes: noteValue,
          }
        }
        return rec
      })

      setAddNoteLoading(true)

      try {
        await updateList(list!.id, {
          recommendations: recommendations,
        })
        await revalidateUrls([getListPageUrl(list!.id)])
        toastSuccess('Note updated successfully')
        appAnalytics.sendEvent({
          action: AnalyticsEventType.RECOMMENDATION_ADD_UPDATE_NOTE,
          extra: {
            listId: list!.id,
            recommendationId: recommendationInfo.id,
          },
        })
        onSuccess(noteValue)
      } catch (e) {
        appAnalytics.captureException(e)
        toastError('Failed to update note')
      } finally {
        setAddNoteLoading(false)
      }
    }

    processCommands()
  }

  return (
    <div className="">
      <CoreTextarea
        value={noteValue}
        setValue={setNoteValue}
        placeholder="A note/review you want to attach"
        className={classNames('h-20')}
        sanitizeOnBlur
      />
      <div>
        <CoreButton
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.SOLID_SECONDARY}
          label={'Cancel'}
          className="mr-1"
          onClick={onCancel}
        />
        <CoreButton
          size={CoreButtonSize.MEDIUM}
          type={CoreButtonType.SOLID_PRIMARY}
          label={'Update'}
          disabled={addNoteLoading}
          loading={addNoteLoading}
          onClick={handleNoteUpdate}
        />
      </div>
    </div>
  )
}

export default AddRecommendationNote
