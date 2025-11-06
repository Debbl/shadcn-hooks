import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimeout } from './index'

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should call function after delay', () => {
    const fn = vi.fn()
    renderHook(() => useTimeout(fn, 100))

    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should use default delay of 0', () => {
    const fn = vi.fn()
    renderHook(() => useTimeout(fn))

    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not call function if delay is negative', () => {
    const fn = vi.fn()
    renderHook(() => useTimeout(fn, -100))

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should clear timeout when component unmounts', () => {
    const fn = vi.fn()
    const { unmount } = renderHook(() => useTimeout(fn, 100))

    expect(fn).not.toHaveBeenCalled()

    unmount()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should clear timeout when delay changes', () => {
    const fn = vi.fn()
    const { rerender } = renderHook(({ delay }) => useTimeout(fn, delay), {
      initialProps: { delay: 100 },
    })

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(fn).not.toHaveBeenCalled()

    rerender({ delay: 200 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should return a clear function', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useTimeout(fn, 100))

    expect(typeof result.current).toBe('function')

    act(() => {
      result.current()
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should allow clearing timeout multiple times', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useTimeout(fn, 100))

    act(() => {
      result.current()
      result.current()
      result.current()
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should update function reference when function changes', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const { rerender } = renderHook(({ fn }) => useTimeout(fn, 100), {
      initialProps: { fn: fn1 },
    })

    rerender({ fn: fn2 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn1).not.toHaveBeenCalled()
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple timeouts independently', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()

    const { result: result1 } = renderHook(() => useTimeout(fn1, 100))
    renderHook(() => useTimeout(fn2, 200))

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)

    // Clear one timeout
    act(() => {
      result1.current()
    })

    // Re-render with new timeout
    renderHook(() => useTimeout(fn1, 100))

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn1).toHaveBeenCalledTimes(2)
  })
})
