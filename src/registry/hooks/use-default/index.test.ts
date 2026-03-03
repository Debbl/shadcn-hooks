import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDefault } from './index'

describe('useDefault', () => {
  it('should return default value when initial value is undefined', () => {
    const { result } = renderHook(() => useDefault<number>(undefined, 10))

    expect(result.current[0]).toBe(10)
  })

  it('should return default value when initial value is null', () => {
    const { result } = renderHook(() => useDefault<string>(null, 'fallback'))

    expect(result.current[0]).toBe('fallback')
  })

  it('should return initial value when it is not nullish', () => {
    const { result } = renderHook(() => useDefault('initial', 'fallback'))

    expect(result.current[0]).toBe('initial')
  })

  it('should update state with a direct value', () => {
    const { result } = renderHook(() => useDefault('initial', 'fallback'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
  })

  it('should return default value after setting state to undefined', () => {
    const { result } = renderHook(() => useDefault<string>(undefined, 'guest'))

    act(() => {
      result.current[1]('alice')
    })
    expect(result.current[0]).toBe('alice')

    act(() => {
      result.current[1](undefined)
    })
    expect(result.current[0]).toBe('guest')
  })

  it('should return default value after setting state to null', () => {
    const { result } = renderHook(() => useDefault<string>(undefined, 'guest'))

    act(() => {
      result.current[1]('alice')
    })
    expect(result.current[0]).toBe('alice')

    act(() => {
      result.current[1](null)
    })
    expect(result.current[0]).toBe('guest')
  })

  it('should support updater function', () => {
    const { result } = renderHook(() => useDefault<number>(1, 0))

    act(() => {
      result.current[1]((prev) => (prev ?? 0) + 1)
    })

    expect(result.current[0]).toBe(2)
  })
})
