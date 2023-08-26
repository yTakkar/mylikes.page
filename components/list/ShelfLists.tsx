import React from 'react'
import { IShelfDetail } from '../../interface/shelf'
import ListInfo from './ListInfo'

interface IShelfListsProps {
  shelf: IShelfDetail
}

const ShelfLists: React.FC<IShelfListsProps> = props => {
  const { shelf } = props

  return (
    <div>
      <div className="text-base lg:text-lg font-medium font-primary-medium mb-2 lg:mb-3">{shelf.name}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6 mt-4 lg:mt-0">
        {shelf.listInfos.map(list => (
          <ListInfo key={list.id} list={list} />
        ))}
      </div>
    </div>
  )
}

export default ShelfLists
