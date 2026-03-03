import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export type UseDefaultState<T> = T | null | undefined

/**
 * Returns `defaultValue` when the current state is `null` or `undefined`.
 */
export function useDefault<T>(
  initialValue: UseDefaultState<T>,
  defaultValue: T,
): readonly [T, Dispatch<SetStateAction<UseDefaultState<T>>>] {
  const [state, setState] = useState<UseDefaultState<T>>(initialValue)
  const value = state ?? defaultValue

  return [value, setState]
}
