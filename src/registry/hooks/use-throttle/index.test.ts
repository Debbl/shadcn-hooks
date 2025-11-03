import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThrottle } from './index'

describe('useThrottle', () => {
  const THROTTLE_MS = 200

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should throttle value changes and update on leading and trailing edges by default', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, THROTTLE_MS),
      { initialProps: { value: 'a' } },
    )

    // Leading edge: should update immediately
    expect(result.current).toBe('a')

    // Rapid value changes
    act(() => {
      rerender({ value: 'b' })
      // Leading edge should execute immediately
      vi.runOnlyPendingTimers()
    })
    expect(result.current).toBe('b')

    act(() => {
      rerender({ value: 'c' })
      rerender({ value: 'd' })
    })

    // Value should not update yet (within throttle window)
    expect(result.current).toBe('b')

    // Advance past throttle period
    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS)
    })
    // Trailing edge should execute with last value
    expect(result.current).toBe('d')
  })

  it('should support leading edge only', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, THROTTLE_MS, { edges: ['leading'] }),
      { initialProps: { value: 'initial' } },
    )

    // Should update immediately on leading edge
    expect(result.current).toBe('initial')

    act(() => {
      rerender({ value: 'first' })
      // Leading edge should execute synchronously within act
      vi.runOnlyPendingTimers()
    })
    // Should update immediately
    expect(result.current).toBe('first')

    act(() => {
      rerender({ value: 'second' })
      rerender({ value: 'third' })
    })

    // Value should remain 'first' (no trailing call)
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS + 10)
    })
    // Still should be 'first', no trailing update
    expect(result.current).toBe('first')
  })

  it('should support trailing edge only', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, THROTTLE_MS, { edges: ['trailing'] }),
      { initialProps: { value: 'initial' } },
    )

    // Initial value should be set
    expect(result.current).toBe('initial')

    act(() => {
      rerender({ value: 'first' })
      // No leading edge, so should remain 'initial'
      vi.runOnlyPendingTimers()
    })
    expect(result.current).toBe('initial')

    act(() => {
      rerender({ value: 'second' })
      rerender({ value: 'third' })
    })

    // Should still be 'initial' (no leading, trailing not yet fired)
    expect(result.current).toBe('initial')

    // Advance past throttle period
    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS)
    })
    // Trailing edge should execute with last value
    expect(result.current).toBe('third')
  })

  it('should support leading and trailing edges', () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        useThrottle(value, THROTTLE_MS, { edges: ['leading', 'trailing'] }),
      { initialProps: { value: 'initial' } },
    )

    // Should update immediately on leading edge
    expect(result.current).toBe('initial')

    act(() => {
      rerender({ value: 'first' })
      // Leading edge should execute synchronously within act
      vi.runOnlyPendingTimers()
    })
    // Should update immediately
    expect(result.current).toBe('first')

    act(() => {
      rerender({ value: 'second' })
      rerender({ value: 'third' })
    })

    // Should still be 'first' (leading edge already fired)
    expect(result.current).toBe('first')

    // Advance past throttle period
    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS + 10)
    })
    // Should update to 'third' on trailing edge
    expect(result.current).toBe('third')
  })

  it('should throttle multiple calls within the time window', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, THROTTLE_MS),
      { initialProps: { value: 1 } },
    )

    expect(result.current).toBe(1)

    act(() => {
      rerender({ value: 2 })
      vi.runOnlyPendingTimers()
    })
    // Leading edge executes immediately
    expect(result.current).toBe(2)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    act(() => {
      rerender({ value: 3 })
    })
    // Should still be 2 (within throttle window, no leading edge again)
    expect(result.current).toBe(2)

    // Advance to trigger trailing edge - should use latest value
    act(() => {
      vi.advanceTimersByTime(100)
      vi.runOnlyPendingTimers()
    })
    // At 200ms total from first leading edge, trailing edge executes with the last value (3)
    expect(result.current).toBe(3)

    // New throttle window starts after trailing edge
    act(() => {
      rerender({ value: 4 })
      vi.runOnlyPendingTimers()
    })
    expect(result.current).toBe(4)

    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS)
    })
    expect(result.current).toBe(4)
  })

  it('should handle number values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, THROTTLE_MS),
      { initialProps: { value: 0 } },
    )

    expect(result.current).toBe(0)

    act(() => {
      rerender({ value: 1 })
      vi.runOnlyPendingTimers()
    })
    expect(result.current).toBe(1)

    act(() => {
      rerender({ value: 2 })
      rerender({ value: 3 })
    })

    expect(result.current).toBe(1)

    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS)
    })

    expect(result.current).toBe(3)
  })

  it('should handle object values', () => {
    const obj1 = { key: 'a' }
    const obj2 = { key: 'b' }
    const obj3 = { key: 'c' }

    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, THROTTLE_MS),
      { initialProps: { value: obj1 } },
    )

    expect(result.current).toBe(obj1)

    act(() => {
      rerender({ value: obj2 })
      vi.runOnlyPendingTimers()
    })
    expect(result.current).toBe(obj2)

    act(() => {
      rerender({ value: obj3 })
    })

    expect(result.current).toBe(obj2)

    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS)
    })

    expect(result.current).toBe(obj3)
    expect(result.current.key).toBe('c')
  })

  it('should use default throttle time of 1000ms when not specified', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value), {
      initialProps: { value: 'a' },
    })

    act(() => {
      rerender({ value: 'b' })
      vi.runOnlyPendingTimers()
    })
    expect(result.current).toBe('b')

    act(() => {
      rerender({ value: 'c' })
    })

    expect(result.current).toBe('b')

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current).toBe('b')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('c')
  })

  it('should initialize with the initial value', () => {
    const { result } = renderHook(() => useThrottle('initial', THROTTLE_MS))

    expect(result.current).toBe('initial')
  })
})
