import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import usePrevious from './index'

describe('usePrevious', () => {
  it('should return undefined on initial render', () => {
    const { result } = renderHook(() => usePrevious('initial'))

    expect(result.current).toBeUndefined()
  })

  it('should return previous value when value changes', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'initial' },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: 'updated' })

    expect(result.current).toBe('initial')
  })

  it('should track previous value across multiple updates', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: 2 })
    expect(result.current).toBe(1)

    rerender({ value: 3 })
    expect(result.current).toBe(2)

    rerender({ value: 4 })
    expect(result.current).toBe(3)
  })

  it('should handle object values', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 2, b: 3 }
    const obj3 = { a: 3, b: 4 }

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj1 },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: obj2 })
    expect(result.current).toBe(obj1)

    rerender({ value: obj3 })
    expect(result.current).toBe(obj2)
  })

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: null as null | undefined | string },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: undefined })
    expect(result.current).toBe(null)

    rerender({ value: 'test' })
    expect(result.current).toBeUndefined()
  })

  it('should handle primitive values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 42 },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: 100 })
    expect(result.current).toBe(42)

    rerender({ value: 200 })
    expect(result.current).toBe(100)
  })

  it('should use custom shouldUpdate function', () => {
    const shouldUpdate = (prev?: number, next?: number) => {
      if (prev === undefined || next === undefined) return true
      return Math.abs(next - prev) >= 10
    }

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value, shouldUpdate),
      {
        initialProps: { value: 5 },
      },
    )

    expect(result.current).toBeUndefined()

    rerender({ value: 8 }) // Difference is 3, should not update
    expect(result.current).toBeUndefined()

    rerender({ value: 20 }) // Difference is 15, should update
    expect(result.current).toBe(5)

    rerender({ value: 25 }) // Difference is 5, should not update
    expect(result.current).toBe(5)

    rerender({ value: 40 }) // Difference is 20, should update
    expect(result.current).toBe(20)
  })

  it('should not update when value is the same (Object.is)', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 5 },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: 5 }) // Same value
    expect(result.current).toBeUndefined()

    rerender({ value: 6 }) // Different value
    expect(result.current).toBe(5)
  })

  it('should handle NaN values', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 5 },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: Number.NaN }) // shouldUpdate(5, NaN) = true, prevRef stores 5, curRef stores NaN
    expect(result.current).toBe(5)

    rerender({ value: Number.NaN }) // Object.is(NaN, NaN) = true, so shouldUpdate returns false, no update
    expect(result.current).toBe(5) // Still previous value (5), not NaN
  })
})
