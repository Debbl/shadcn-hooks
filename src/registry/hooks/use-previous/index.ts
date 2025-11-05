import { useRef } from 'react'

export type ShouldUpdateFunc<T> = (prev?: T, next?: T) => boolean

const defaultShouldUpdate = <T>(a?: T, b?: T) => !Object.is(a, b)

function usePrevious<T>(
  state: T,
  shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate,
): T | undefined {
  const prevRef = useRef<T>(undefined)
  const curRef = useRef<T>(undefined)

  // Capture the previous value before any updates
  const previous = curRef.current

  // Only update prevRef conditionally based on shouldUpdate
  if (shouldUpdate(previous, state)) {
    prevRef.current = previous
  }

  // Always update curRef with the latest state to maintain correct baseline
  curRef.current = state

  return prevRef.current
}

export default usePrevious
