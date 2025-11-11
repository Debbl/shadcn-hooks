import { useEffect, useState } from 'react'
import { useDebounceFn } from '~/hooks/use-debounce-fn'
import { useUpdateEffect } from '~/hooks/use-update-effect'
import type { DependencyList, EffectCallback } from 'react'

interface DebounceOptions {
  /**
   * An optional AbortSignal to cancel the debounced function.
   */
  signal?: AbortSignal
  /**
   * An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both.
   * If `edges` includes "leading", the function will be invoked at the start of the delay period.
   * If `edges` includes "trailing", the function will be invoked at the end of the delay period.
   * If both "leading" and "trailing" are included, the function will be invoked at both the start and end of the delay period.
   * @default ["trailing"]
   */
  edges?: Array<'leading' | 'trailing'>
}

export function useDebounceEffect(
  effect: EffectCallback,
  deps: DependencyList,
  debounceMs?: number,
  options?: DebounceOptions,
) {
  const [flag, setFlag] = useState({})
  const { run } = useDebounceFn(
    () => {
      setFlag({})
    },
    debounceMs,
    options,
  )

  useEffect(() => {
    return run()
  }, deps)

  useUpdateEffect(() => {
    return effect()
  }, [flag])
}
