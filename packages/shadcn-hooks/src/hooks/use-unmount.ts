import { useEffect } from 'react'
import { useLatest } from '~/hooks/use-latest'

export function useUnmount(fn: () => void) {
  const fnRef = useLatest(fn)

  useEffect(
    () => () => {
      fnRef.current()
    },
    [],
  )
}
