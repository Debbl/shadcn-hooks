import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCounter } from './index'

const setUp = (initialValue: number = 0) =>
  renderHook((value) => useCounter(value), { initialProps: initialValue })

describe('useCounter', () => {
  it('should return default value', () => {
    const { result } = setUp()
    const [count] = result.current

    expect(count).toBe(0)
  })

  it('should return initial value', () => {
    const { result } = setUp(5)
    const [count] = result.current

    expect(count).toBe(5)
  })

  it('should increment the counter', () => {
    const { result } = setUp(0)
    const [_, { inc }] = result.current

    act(() => {
      inc()
    })

    expect(result.current[0]).toBe(1)

    act(() => {
      inc()
    })

    expect(result.current[0]).toBe(2)
  })

  it('should decrement the counter', () => {
    const { result } = setUp(5)
    const [_, { dec }] = result.current

    act(() => {
      dec()
    })

    expect(result.current[0]).toBe(4)

    act(() => {
      dec()
    })

    expect(result.current[0]).toBe(3)
  })

  it('should set the counter to a specific value', () => {
    const { result } = setUp(0)
    const [_, { set }] = result.current

    act(() => {
      set(10)
    })

    expect(result.current[0]).toBe(10)

    act(() => {
      set(20)
    })

    expect(result.current[0]).toBe(20)
  })

  it('should set the counter using a function', () => {
    const { result } = setUp(5)
    const [_, { set }] = result.current

    act(() => {
      set((prev) => prev * 2)
    })

    expect(result.current[0]).toBe(10)

    act(() => {
      set((prev) => prev + 5)
    })

    expect(result.current[0]).toBe(15)
  })

  it('should reset the counter to initial value', () => {
    const { result } = setUp(3)
    const [_, { inc, reset }] = result.current

    act(() => {
      inc()
      inc()
    })

    expect(result.current[0]).toBe(5)

    act(() => {
      reset()
    })

    expect(result.current[0]).toBe(3)
  })

  it('should handle multiple operations', () => {
    const { result } = setUp(0)
    const [_, { inc, dec, set }] = result.current

    act(() => {
      inc()
      inc()
      dec()
      set(10)
      inc()
    })

    expect(result.current[0]).toBe(11)
  })
})
