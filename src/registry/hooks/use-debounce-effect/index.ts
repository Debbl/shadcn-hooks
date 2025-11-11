import { useEffect, useState } from 'react'
import { useDebounceFn } from '@/registry/hooks/use-debounce-fn'
import { useUpdateEffect } from '@/registry/hooks/use-update-effect'
import type { DependencyList, EffectCallback } from 'react'
import type { DebounceOptions } from '@/registry/hooks/use-debounce-fn'

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
