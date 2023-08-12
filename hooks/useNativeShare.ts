import { useState, useEffect, useContext } from 'react'
import ApplicationContext from '../components/ApplicationContext'
import appConfig from '../config/appConfig'

declare let window: any

interface IProps {
  onShareFail?: () => void
}

const useNativeShare = (props: IProps) => {
  const { onShareFail } = props

  const [shouldshowNativeShare, toggleNativeShare] = useState(false)

  const {
    device: { isMobile },
  } = useContext(ApplicationContext)

  useEffect(() => {
    if (window.navigator.share && isMobile) {
      toggleNativeShare(true)
    }
  }, [])

  const handleNativeShare = ({ title, text, url }: { title?: string; text: string; url: string }) => {
    if (window.navigator.share) {
      window.navigator
        .share({
          title: title || appConfig.global.app.name,
          text,
          url: url,
        })
        .catch((e: any) => {
          console.log(e, e.name, e.message)

          if (!['AbortError'].includes(e.name)) {
            // https://hotstar.atlassian.net/browse/ER-1904
            // https://developer.apple.com/forums/thread/662629
            onShareFail?.()
          }
        })
    }
  }

  return {
    shouldshowNativeShare,
    handleNativeShare,
  }
}

export default useNativeShare
