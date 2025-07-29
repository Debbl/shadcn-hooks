import { dequal } from 'dequal'
import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/registry/hooks/use-isomorphic-layout-effect'
import type { DependencyList, EffectCallback } from 'react'

export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList,
) {
  const ref = useRef<DependencyList>(deps)

  if (!ref.current || !dequal(ref.current, deps)) {
    ref.current = deps
  }

  useIsomorphicLayoutEffect(effect, ref.current)
}
