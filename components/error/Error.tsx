import React, { useContext } from 'react'
import { prepareImageUrl } from '../../utils/image'
import CoreImage, { ImageSourceType } from '../core/CoreImage'
import ShelfLists from '../list/ShelfLists'
import { IShelfDetail } from '../../interface/shelf'
import ApplicationContext from '../ApplicationContext'

interface IErrorProps {
  shelf: IShelfDetail | null
}

const Error: React.FC<IErrorProps> = props => {
  const { shelf: serverShelf } = props

  const applicationContext = useContext(ApplicationContext)
  const {
    ads: { featuredListsShelf },
  } = applicationContext

  const shelf = serverShelf || featuredListsShelf

  console.log('Error', serverShelf, featuredListsShelf)

  return (
    <div>
      <div>
        <div className="flex flex-col items-center justify-center mt-20">
          <CoreImage
            url={prepareImageUrl('/images/empty/empty-glass.svg', ImageSourceType.ASSET)}
            alt="Page not found"
            className="w-52 min-h-52 lg:w-60"
            useTransparentPlaceholder
          />
          <div className="text-center text-lg lg:text-xl mt-5 w-[320px] md:w-auto font-medium font-primary-medium text-primaryTextBold">
            Site under maintenance.
          </div>
          <div className="text-center mt-1 w-[320px] md:w-auto">{`We're working on a few fixes and updates. Sorry for the Inconvenience.`}</div>
        </div>
      </div>

      {shelf && (
        <div className="mt-10 px-3">
          <ShelfLists shelf={shelf} source="error" />
        </div>
      )}
    </div>
  )
}

export default Error
