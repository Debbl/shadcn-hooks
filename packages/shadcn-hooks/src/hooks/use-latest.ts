import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'

export function useLatest<T>(value: T) {
  const ref = useRef(value)

  useIsomorphicLayoutEffect(() => {
    ref.current = value
  })

  return ref
}
