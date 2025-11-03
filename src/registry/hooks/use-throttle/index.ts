import { useEffect, useState } from 'react'
import { useThrottleFn } from '@/registry/hooks/use-throttle-fn'

interface ThrottleOptions {
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

export function useThrottle<T>(
  value: T,
  throttleMs?: number,
  options?: ThrottleOptions,
) {
  const [throttledValue, setThrottledValue] = useState<T>(value)

  const { run } = useThrottleFn(
    () => {
      setThrottledValue(value)
    },
    throttleMs,
    options,
  )

  useEffect(() => {
    run()
  }, [value, run])

  return throttledValue
}
