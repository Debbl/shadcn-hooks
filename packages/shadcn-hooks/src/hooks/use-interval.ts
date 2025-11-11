import { useCallback, useEffect, useRef } from 'react'
import { useMemoizedFn } from '~/hooks/use-memoized-fn'

export function useInterval(
  fn: () => void,
  delay?: number,
  options?: { immediate?: boolean },
) {
  const fnRef = useMemoizedFn(fn)
  const timerRef = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!(typeof delay === 'number') || delay < 0) {
      return
    }

    if (options?.immediate) {
      fnRef()
    }

    timerRef.current = window.setInterval(fnRef, delay)

    return () => {
      clear()
    }
  }, [delay, options?.immediate, fnRef, clear])

  return clear
}
