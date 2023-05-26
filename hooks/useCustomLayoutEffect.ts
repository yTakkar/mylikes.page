import { EffectCallback, useLayoutEffect } from 'react'
import useSSR from 'use-ssr'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const useDummyEffect = () => {}

const useCustomLayoutEffect = (effect: EffectCallback, params: Array<any>) => {
  const { isServer } = useSSR()
  const effectFn = isServer ? useDummyEffect : useLayoutEffect
  effectFn(effect, params)
}

export default useCustomLayoutEffect
