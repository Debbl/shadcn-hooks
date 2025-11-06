import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInterval } from './index'

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should call function repeatedly at interval', () => {
    const fn = vi.fn()
    renderHook(() => useInterval(fn, 100))

    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(2)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('should use default delay of undefined', () => {
    const fn = vi.fn()
    renderHook(() => useInterval(fn))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should not call function if delay is undefined', () => {
    const fn = vi.fn()
    renderHook(() => useInterval(fn, undefined))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should not call function if delay is negative', () => {
    const fn = vi.fn()
    renderHook(() => useInterval(fn, -100))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should clear interval when component unmounts', () => {
    const fn = vi.fn()
    const { unmount } = renderHook(() => useInterval(fn, 100))

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(fn).not.toHaveBeenCalled()

    unmount()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should clear interval when delay changes', () => {
    const fn = vi.fn()
    const { rerender } = renderHook(({ delay }) => useInterval(fn, delay), {
      initialProps: { delay: 100 as number | undefined },
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

  it('should pause interval when delay is set to null', () => {
    const fn = vi.fn()
    const { rerender } = renderHook(({ delay }) => useInterval(fn, delay), {
      initialProps: { delay: 100 as number | undefined },
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(1)

    rerender({ delay: undefined })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should return a clear function', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useInterval(fn, 100))

    expect(typeof result.current).toBe('function')

    act(() => {
      result.current()
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).not.toHaveBeenCalled()
  })

  it('should allow clearing interval multiple times', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useInterval(fn, 100))

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
    const { rerender } = renderHook(({ fn }) => useInterval(fn, 100), {
      initialProps: { fn: fn1 },
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).not.toHaveBeenCalled()

    rerender({ fn: fn2 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple intervals independently', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()

    const { result: result1 } = renderHook(() => useInterval(fn1, 100))
    renderHook(() => useInterval(fn2, 200))

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn1).toHaveBeenCalledTimes(2)
    expect(fn2).toHaveBeenCalledTimes(1)

    // Clear one interval
    act(() => {
      result1.current()
    })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(fn1).toHaveBeenCalledTimes(2)
    expect(fn2).toHaveBeenCalledTimes(2)
  })

  it('should call function immediately when immediate option is true', () => {
    const fn = vi.fn()
    renderHook(() => useInterval(fn, 100, { immediate: true }))

    expect(fn).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should not call function immediately when immediate option is false', () => {
    const fn = vi.fn()
    renderHook(() => useInterval(fn, 100, { immediate: false }))

    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not call function immediately when immediate option is not provided', () => {
    const fn = vi.fn()
    renderHook(() => useInterval(fn, 100))

    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should handle immediate option changes', () => {
    const fn = vi.fn()
    const { rerender } = renderHook(
      ({ delay, options }) => useInterval(fn, delay, options),
      {
        initialProps: { delay: 100, options: { immediate: false } },
      },
    )

    expect(fn).not.toHaveBeenCalled()

    rerender({ delay: 100, options: { immediate: true } })

    expect(fn).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it(
    'should call function immediately even when delay is 0',
    { todo: true },
    () => {
      const fn = vi.fn()
      renderHook(() => useInterval(fn, 0, { immediate: true }))

      expect(fn).toHaveBeenCalledTimes(1)

      act(() => {
        vi.advanceTimersByTime(0)
      })

      expect(fn).toHaveBeenCalledTimes(2)
    },
  )
})
