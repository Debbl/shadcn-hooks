import { useMemo, useReducer } from 'react'

function reducer(
  state: number,
  action:
    | { type: 'set'; payload: number | ((value: number) => number) }
    | { type: 'inc' }
    | { type: 'dec' },
) {
  switch (action.type) {
    case 'set':
      if (typeof action.payload === 'function') {
        return action.payload(state)
      }
      return action.payload
    case 'inc':
      return state + 1
    case 'dec':
      return state - 1
  }
}

export function useCounter(initialValue: number = 0) {
  const [count, dispatch] = useReducer(reducer, initialValue)

  return [
    count,
    useMemo(
      () => ({
        set: (value: number | ((value: number) => number)) =>
          dispatch({ type: 'set', payload: value }),
        inc: () => dispatch({ type: 'inc' }),
        dec: () => dispatch({ type: 'dec' }),
        reset: () => dispatch({ type: 'set', payload: initialValue }),
      }),
      [dispatch],
    ),
  ] as const
}
