import { useEffect, useState } from 'react'
import { useThrottleFn } from '~/hooks/use-throttle-fn'
import { useUpdateEffect } from '~/hooks/use-update-effect'
import type { DependencyList, EffectCallback } from 'react'
import type { ThrottleOptions } from '~/hooks/use-throttle-fn'

export function useThrottleEffect(
  effect: EffectCallback,
  deps: DependencyList,
  throttleMs?: number,
  options?: ThrottleOptions,
) {
  const [flag, setFlag] = useState({})
  const { run } = useThrottleFn(
    () => {
      setFlag({})
    },
    throttleMs,
    options,
  )

  useEffect(() => {
    return run()
  }, deps)

  useUpdateEffect(() => {
    return effect()
  }, [flag])
}
