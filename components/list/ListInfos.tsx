import React, { useContext } from 'react'
import { IListDetail, ListVisibilityType } from '../../interface/list'
import ListInfo from './ListInfo'
import { PlusIcon } from '@heroicons/react/solid'
import NoContent from '../NoContent'
import { CoreButtonSize, CoreButtonType } from '../core/CoreButton'
import ApplicationContext from '../ApplicationContext'
import { PopupType } from '../../interface/popup'
import { IUserInfo } from '../../interface/user'
import { isSessionUser } from '../../utils/user'
import { pluralize } from '../../utils/common'

interface IListInfoProps {
  lists: IListDetail[]
  profileUser: IUserInfo
}

const ListInfos: React.FC<IListInfoProps> = props => {
  const { lists, profileUser } = props

  const applicationContext = useContext(ApplicationContext)
  const { user, methods } = applicationContext

  const sessionUser = isSessionUser(user, profileUser)

  const handleNewList = () => {
    methods.togglePopup(PopupType.CREATE_LIST, {})
  }

  const listsToShow = (sessionUser ? lists : lists.filter(list => list.visibility === ListVisibilityType.PUBLIC)).sort(
    (a, b) => b.createdAt - a.createdAt
  )

  if (listsToShow.length === 0) {
    return (
      <NoContent
        message={
          sessionUser ? `You don't have any lists yet. Create one now!` : `This user doesn't have any lists yet.`
        }
        actions={
          sessionUser
            ? [
                {
                  label: (
                    <div className="flex">
                      <PlusIcon className="w-5 mr-1" />
                      New List
                    </div>
                  ),
                  size: CoreButtonSize.MEDIUM,
                  type: CoreButtonType.SOLID_PRIMARY,
                  onClick: handleNewList,
                },
              ]
            : undefined
        }
        imageClassName="w-full lg:w-[700px]"
      />
    )
  }

  return (
    <div>
      {sessionUser && (
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Showing {pluralize('list', listsToShow.length)}</div>

          <div
            className="bg-gallery font-medium cursor-pointer py-2 px-3 rounded font-primary-medium"
            onClick={handleNewList}>
            <div className="flex">
              <PlusIcon className="w-6 mr-1" />
              New List
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6 mt-4 lg:mt-0">
        {listsToShow.map(list => (
          <ListInfo key={list.id} list={list} />
        ))}
      </div>
    </div>
  )
}

export default ListInfos
