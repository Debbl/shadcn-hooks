import { throttle } from 'es-toolkit'
import { useMemo } from 'react'
import { useLatest } from '~/hooks/use-latest'
import { useUnmount } from '~/hooks/use-unmount'

export interface ThrottleOptions {
  /**
   * An optional AbortSignal to cancel the throttled function.
   */
  signal?: AbortSignal
  /**
   * An optional array specifying whether the function should be invoked on the leading edge, trailing edge, or both.
   * If `edges` includes "leading", the function will be invoked at the start of the delay period.
   * If `edges` includes "trailing", the function will be invoked at the end of the delay period.
   * If both "leading" and "trailing" are included, the function will be invoked at both the start and end of the delay period.
   * @default ["leading", "trailing"]
   */
  edges?: Array<'leading' | 'trailing'>
}

export function useThrottleFn<Fn extends (...args: any[]) => any>(
  fn: Fn,
  throttleMs?: number,
  options?: ThrottleOptions,
) {
  const fnRef = useLatest(fn)

  const throttledFn = useMemo(
    () =>
      throttle(
        (...args: Parameters<Fn>) => fnRef.current(...args),
        throttleMs ?? 1000,
        options,
      ),
    [],
  )

  useUnmount(() => throttledFn.cancel())

  return {
    run: throttledFn,
    cancel: throttledFn.cancel,
    flush: throttledFn.flush,
  }
}
