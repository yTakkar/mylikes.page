import React, { useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import { IListDetail } from '../../interface/list'
import CoreSelectInput, { ICoreSelectInputOption } from '../core/CoreSelectInput'
import ListAnalyticsRecommendationVisits from '../list/analytics/ListAnalyticsRecommendationVisits'
import ListAnalyticsLibrarySaves from '../list/analytics/ListAnalyticsLibrarySaves'
import ListAnalyticsAddedToList from '../list/analytics/ListAnalyticsAddedToList'
import CoreDivider from '../core/CoreDivider'
import { ArrowLeftIcon } from '@heroicons/react/solid'

const options: ICoreSelectInputOption[] = [
  {
    id: 'recommendation-visits',
    value: 'recommendation-visits',
    label: 'Recommendations visits',
    selected: true,
  },
  {
    id: 'library-add',
    value: 'library-add',
    label: 'List clones',
    selected: false,
  },
  {
    id: 'recommendation-add-to-list',
    value: 'recommendation-add-to-list',
    label: 'Recommendations added to lists',
    selected: false,
  },
]

interface IListAnalyticsPopupProps {
  onClose: () => void
  listDetail: IListDetail
}

const ListAnalyticsPopup: React.FC<IListAnalyticsPopupProps> = props => {
  const { listDetail, onClose } = props

  const [selectedOption, setSelectedOption] = useState(options[0].value)

  const renderAnalyticsComponent = () => {
    if (selectedOption === options[0].value) {
      return <ListAnalyticsRecommendationVisits listDetail={listDetail} />
    }
    if (selectedOption === options[1].value) {
      return <ListAnalyticsLibrarySaves listDetail={listDetail} />
    }
    if (selectedOption === options[2].value) {
      return <ListAnalyticsAddedToList listDetail={listDetail} />
    }
    return null
  }

  return (
    <FullWidthModal
      modal={{
        dismissModal: onClose,
        title: (
          <div className={'flex items-center'}>
            <div
              className="w-5 mr-3 cursor-pointer relative transform transition-transform hover:scale-110"
              onClick={onClose}>
              <ArrowLeftIcon />
            </div>
            <div>List Analytics</div>
          </div>
        ),
        wrapInContainer: true,
        showCrossIcon: false,
        disableOutsideClick: true,
      }}
      footer={undefined}
      className="listAnalyticsPopupOverrides">
      <div className="px-3 pt-3">
        <CoreSelectInput value={selectedOption} onChange={setSelectedOption} options={options} />
        <CoreDivider className="my-4" />
        <div>{renderAnalyticsComponent()}</div>
      </div>
    </FullWidthModal>
  )
}

export default ListAnalyticsPopup
