import { debounce } from 'es-toolkit'
import { useMemo } from 'react'
import { useLatest } from '@/registry/hooks/use-latest'
import { useUnmount } from '@/registry/hooks/use-unmount'
import type { DebounceOptions } from 'es-toolkit'

export type { DebounceOptions }

export function useDebounceFn<Fn extends (...args: any[]) => any>(
  fn: Fn,
  debounceMs?: number,
  options?: DebounceOptions,
) {
  const fnRef = useLatest(fn)

  const debouncedFn = useMemo(
    () =>
      debounce(
        (...args: Parameters<Fn>) => fnRef.current(...args),
        debounceMs ?? 1000,
        options,
      ),
    [],
  )

  useUnmount(() => debouncedFn.cancel())

  return {
    run: debouncedFn,
    cancel: debouncedFn.cancel,
    flush: debouncedFn.flush,
  }
}
