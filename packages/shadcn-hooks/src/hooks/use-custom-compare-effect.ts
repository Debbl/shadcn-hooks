import { useEffect, useRef } from 'react'
import type { DependencyList, EffectCallback } from 'react'

export function useCustomCompareEffect<T extends DependencyList>(
  effect: EffectCallback,
  deps: T,
  customCompare: (a: T, b: T) => boolean,
) {
  const ref = useRef<T>(deps)

  if (!ref.current || !customCompare(ref.current, deps)) {
    ref.current = deps
  }

  useEffect(effect, ref.current)
}
