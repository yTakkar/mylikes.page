import React from 'react'
import { IListDetail } from '../../interface/list'
import ListInfo from './ListInfo'
import { PlusIcon } from '@heroicons/react/solid'
import NoContent from '../NoContent'
import { CoreButtonSize, CoreButtonType } from '../core/CoreButton'

interface IListInfoProps {
  // lists: IListDetail[]
}

const ListInfos: React.FC<IListInfoProps> = props => {
  const list = Array.from({ length: 0 })

  if (list.length === 0) {
    return (
      <NoContent
        message="You don't have any lists yet. Create one now!"
        actions={[
          {
            label: (
              <div className="flex">
                <PlusIcon className="w-5 mr-1" />
                New List
              </div>
            ),
            size: CoreButtonSize.MEDIUM,
            type: CoreButtonType.SOLID_PRIMARY,
            // onClick: handleNewRecommendation,
          },
        ]}
        imageClassName="w-full lg:w-[700px]"
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <div className="bg-gallery font-medium cursor-pointer py-2 px-3 rounded font-primary-medium">
          <div className="flex">
            <PlusIcon className="w-6 mr-1" />
            New List
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6 mt-4 lg:mt-0">
        {list.map((_, i) => (
          <ListInfo key={i} />
        ))}
      </div>
    </div>
  )
}

export default ListInfos
