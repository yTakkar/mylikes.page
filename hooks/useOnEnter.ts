import React, { useEffect, useState } from 'react'

const useOnEnter = (elementRef: React.RefObject<any>, handleSubmit: () => void) => {
  const [shortcut, setShortcut] = useState<number | null>(null)

  useEffect(() => {
    if (shortcut === 13) {
      handleSubmit()
    }
  }, [shortcut])

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      setShortcut(event.keyCode)
    }

    if (elementRef.current) {
      elementRef.current.addEventListener('keydown', handleKeyUp)
    }
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('keydown', handleKeyUp)
      }
    }
  }, [])
}

export default useOnEnter
