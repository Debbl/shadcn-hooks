import { useCallback, useEffect, useRef } from 'react'
import { useMemoizedFn } from '@/registry/hooks/use-memoized-fn'

export function useTimeout(fn: () => void, delay: number = 0) {
  const fnRef = useMemoizedFn(fn)
  const timerRef = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (delay < 0) return

    timerRef.current = window.setTimeout(fnRef, delay)

    return () => {
      clear()
    }
  }, [delay])

  return clear
}
