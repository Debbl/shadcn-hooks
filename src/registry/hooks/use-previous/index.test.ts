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

    rerender({ value: 8 }) // Difference is 3, should not update prevRef, but curRef updates to 8
    expect(result.current).toBeUndefined()

    rerender({ value: 20 }) // Difference from 8 is 12, should update (compares against 8, not 5)
    expect(result.current).toBe(8) // Previous value is 8 (the last curRef before update)

    rerender({ value: 25 }) // Difference is 5, should not update
    expect(result.current).toBe(8)

    rerender({ value: 40 }) // Difference from 25 is 15, should update (compares against 25)
    expect(result.current).toBe(25) // Previous value is 25
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

  it('should always update curRef even when shouldUpdate returns false', () => {
    // Custom shouldUpdate: only accept odd numbers
    const shouldUpdate = (prev?: number, next?: number) => {
      if (prev === undefined || next === undefined) return true
      return next % 2 === 1 // Only update when next is odd
    }

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value, shouldUpdate),
      {
        initialProps: { value: 1 },
      },
    )

    expect(result.current).toBeUndefined()

    // Same odd number: shouldUpdate(1, 1) = true, prevRef stores 1 (previous curRef), curRef = 1
    rerender({ value: 1 })
    expect(result.current).toBe(1) // prevRef is 1 (previous curRef)

    // Even number: shouldUpdate(1, 2) = false, prevRef doesn't update
    // But curRef should update to 2 for next comparison
    rerender({ value: 2 })
    expect(result.current).toBe(1) // prevRef still 1

    // Another odd number: shouldUpdate(2, 3) should compare against 2 (not 1)
    // If curRef wasn't updated when shouldUpdate returned false, it would compare (1, 3) which is wrong
    // Since curRef was updated to 2, it correctly compares (2, 3)
    rerender({ value: 3 })
    expect(result.current).toBe(2) // Previous curRef value (2) before update, not 1

    // Even number again: shouldUpdate(3, 4) = false, curRef updates to 4
    rerender({ value: 4 })
    expect(result.current).toBe(2) // prevRef unchanged

    // Next odd number: shouldUpdate(4, 5) should compare against 4 (not 3)
    // This proves curRef was updated correctly when shouldUpdate returned false
    rerender({ value: 5 })
    expect(result.current).toBe(4) // Previous curRef value (4) before update, not 3
  })
})
