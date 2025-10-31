import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './index'

describe('useDebounce', () => {
  const DEBOUNCE_MS = 200

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should debounce value changes and update once on trailing edge by default', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, DEBOUNCE_MS),
      { initialProps: { value: 'a' } },
    )

    expect(result.current).toBe('a')

    // Rapid value changes
    act(() => {
      rerender({ value: 'b' })
      rerender({ value: 'c' })
      rerender({ value: 'd' })
    })

    // Value should not update yet
    expect(result.current).toBe('a')

    // Advance just before threshold
    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS - 1)
    })
    expect(result.current).toBe('a')

    // Advance past threshold
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('d')
  })

  it('should support leading edge only', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, DEBOUNCE_MS, { edges: ['leading'] }),
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
      vi.advanceTimersByTime(DEBOUNCE_MS + 10)
    })
    // Still should be 'first', no trailing update
    expect(result.current).toBe('first')
  })

  it('should support leading and trailing edges', () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        useDebounce(value, DEBOUNCE_MS, { edges: ['leading', 'trailing'] }),
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

    // Advance past debounce period
    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS + 10)
    })
    // Should update to 'third' on trailing edge
    expect(result.current).toBe('third')
  })

  it('should handle number values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, DEBOUNCE_MS),
      { initialProps: { value: 0 } },
    )

    expect(result.current).toBe(0)

    act(() => {
      rerender({ value: 1 })
      rerender({ value: 2 })
      rerender({ value: 3 })
    })

    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS)
    })

    expect(result.current).toBe(3)
  })

  it('should handle object values', () => {
    const obj1 = { key: 'a' }
    const obj2 = { key: 'b' }
    const obj3 = { key: 'c' }

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, DEBOUNCE_MS),
      { initialProps: { value: obj1 } },
    )

    expect(result.current).toBe(obj1)

    act(() => {
      rerender({ value: obj2 })
      rerender({ value: obj3 })
    })

    expect(result.current).toBe(obj1)

    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS)
    })

    expect(result.current).toBe(obj3)
    expect(result.current.key).toBe('c')
  })

  it('should use default debounce time of 1000ms when not specified', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'a' },
    })

    act(() => {
      rerender({ value: 'b' })
    })

    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('b')
  })

  it('should initialize with the initial value', () => {
    const { result } = renderHook(() => useDebounce('initial', DEBOUNCE_MS))

    expect(result.current).toBe('initial')
  })
})
