import { dequal } from 'dequal'
import { useLayoutEffect, useRef } from 'react'
import type { DependencyList, EffectCallback } from 'react'

export function useDeepCompareLayoutEffect(
  effect: EffectCallback,
  deps: DependencyList,
) {
  const ref = useRef<DependencyList>(deps)

  if (!ref.current || !dequal(ref.current, deps)) {
    ref.current = deps
  }

  useLayoutEffect(effect, ref.current)
}
