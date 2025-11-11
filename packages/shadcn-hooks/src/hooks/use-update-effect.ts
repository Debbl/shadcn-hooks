import { useEffect, useRef } from 'react'
import { useUnmount } from '~/hooks/use-unmount'
import type { DependencyList, EffectCallback } from 'react'

export function useUpdateEffect(effect: EffectCallback, deps: DependencyList) {
  const mounted = useRef(false)

  // for react-refresh
  useUnmount(() => {
    mounted.current = false
  })

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }

    return effect()
  }, deps)
}
