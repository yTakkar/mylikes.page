import { useRef, useEffect } from 'react'

const useUpdateEffect = (effect: () => any, dependencies: any = []) => {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

export default useUpdateEffect
