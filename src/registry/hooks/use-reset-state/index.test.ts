import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useResetState } from './index'

const setUp = <S>(initialState: S | (() => S)) =>
  renderHook((state) => useResetState(state), { initialProps: initialState })

describe('useResetState', () => {
  it('should return initial value', () => {
    const { result } = setUp(0)
    const [value] = result.current

    expect(value).toBe(0)
  })

  it('should return initial value from function', () => {
    const { result } = setUp(() => 10)
    const [value] = result.current

    expect(value).toBe(10)
  })

  it('should update state with setState', () => {
    const { result } = setUp(0)
    const [_, setState] = result.current

    act(() => {
      setState(5)
    })

    expect(result.current[0]).toBe(5)

    act(() => {
      setState(10)
    })

    expect(result.current[0]).toBe(10)
  })

  it('should update state with setState function', () => {
    const { result } = setUp(0)
    const [_, setState] = result.current

    act(() => {
      setState((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)

    act(() => {
      setState((prev) => prev * 2)
    })

    expect(result.current[0]).toBe(2)
  })

  it('should reset state to initial value', () => {
    const { result } = setUp(0)
    const [_, setState, resetState] = result.current

    act(() => {
      setState(5)
    })

    expect(result.current[0]).toBe(5)

    act(() => {
      resetState()
    })

    expect(result.current[0]).toBe(0)
  })

  it('should reset state to initial value after multiple updates', () => {
    const { result } = setUp(10)
    const [_, setState, resetState] = result.current

    act(() => {
      setState(20)
      setState(30)
      setState(40)
    })

    expect(result.current[0]).toBe(40)

    act(() => {
      resetState()
    })

    expect(result.current[0]).toBe(10)
  })

  it('should reset state to initial value from function', () => {
    const { result } = setUp(() => ({ count: 0, name: 'initial' }))
    const [_, setState, resetState] = result.current

    act(() => {
      setState({ count: 5, name: 'updated' })
    })

    expect(result.current[0]).toEqual({ count: 5, name: 'updated' })

    act(() => {
      resetState()
    })

    expect(result.current[0]).toEqual({ count: 0, name: 'initial' })
  })

  it('should maintain reset function reference across renders', () => {
    const { result, rerender } = setUp(0)
    const [, , resetState1] = result.current

    act(() => {
      result.current[1](5)
    })

    rerender(0)
    const [, , resetState2] = result.current

    expect(resetState1).toBe(resetState2)
  })

  it('should work with string state', () => {
    const { result } = setUp('initial')
    const [_, setState, resetState] = result.current

    act(() => {
      setState('updated')
    })

    expect(result.current[0]).toBe('updated')

    act(() => {
      resetState()
    })

    expect(result.current[0]).toBe('initial')
  })

  it('should work with array state', () => {
    const { result } = setUp([1, 2, 3])
    const [_, setState, resetState] = result.current

    act(() => {
      setState([4, 5, 6])
    })

    expect(result.current[0]).toEqual([4, 5, 6])

    act(() => {
      resetState()
    })

    expect(result.current[0]).toEqual([1, 2, 3])
  })

  it('should work with object state', () => {
    const initialState = { a: 1, b: 2 }
    const { result } = setUp(initialState)
    const [_, setState, resetState] = result.current

    act(() => {
      setState({ a: 3, b: 4 })
    })

    expect(result.current[0]).toEqual({ a: 3, b: 4 })

    act(() => {
      resetState()
    })

    expect(result.current[0]).toEqual({ a: 1, b: 2 })
  })

  it('should handle multiple reset calls', () => {
    const { result } = setUp(0)
    const [_, setState, resetState] = result.current

    act(() => {
      setState(100)
    })

    expect(result.current[0]).toBe(100)

    act(() => {
      resetState()
      resetState()
      resetState()
    })

    expect(result.current[0]).toBe(0)
  })
})
