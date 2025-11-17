import { throttle } from 'es-toolkit'
import { useMemo } from 'react'
import { useLatest } from '@/registry/hooks/use-latest'
import { useUnmount } from '@/registry/hooks/use-unmount'
import type { ThrottleOptions } from 'es-toolkit'

export type { ThrottleOptions }

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
