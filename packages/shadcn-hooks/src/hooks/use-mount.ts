import { useEffect } from 'react'
import type { EffectCallback } from 'react'

type MountCallback = EffectCallback | (() => Promise<void | (() => void)>)

export function useMount(fn: MountCallback) {
  useEffect(() => {
    const result = fn?.()
    // If fn returns a Promise, don't return it as cleanup function
    if (
      result &&
      typeof result === 'object' &&
      typeof (result as any).then === 'function'
    ) {
      return
    }

    return result as ReturnType<EffectCallback>
  }, [])
}
