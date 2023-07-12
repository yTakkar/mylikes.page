import React, { useState } from 'react'
import FullWidthModal from '../modal/FullWidthModal'
import { IListDetail } from '../../interface/list'
import CoreSelectInput, { ICoreSelectInputOption } from '../core/CoreSelectInput'

const options: ICoreSelectInputOption[] = [
  {
    id: 'no-of-clicks',
    value: 'no-of-clicks',
    label: 'Recommendation visits',
    selected: false,
  },
  {
    id: 'no-of-clicks',
    value: 'no-of-clicks',
    label: 'No. of clicks',
    selected: false,
  },
  {
    id: 'no-of-clicks',
    value: 'no-of-clicks',
    label: 'No. of clicks',
    selected: false,
  },
]

interface IListAnalyticsPopupProps {
  onClose: () => void
  listDetail: IListDetail
}

const ListAnalyticsPopup: React.FC<IListAnalyticsPopupProps> = props => {
  const { onClose } = props

  const [selectedOption, setSelectedOption] = useState(options[0].value)

  return (
    <FullWidthModal
      modal={{
        dismissModal: onClose,
        title: (
          <div>
            <CoreSelectInput value={selectedOption} onChange={setSelectedOption} options={options} />
          </div>
        ),
      }}
      className="listAnalyticsPopup">
      <div></div>
    </FullWidthModal>
  )
}

export default ListAnalyticsPopup
