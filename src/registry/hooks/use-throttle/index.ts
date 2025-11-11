import { useEffect, useState } from 'react'
import { useThrottleFn } from '@/registry/hooks/use-throttle-fn'
import type { ThrottleOptions } from '@/registry/hooks/use-throttle-fn'

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
