import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useThrottleFn } from './index'

describe('useThrottleFn', () => {
  it('should throttle calls and run on leading and trailing edges by default', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottleFn(fn, 200))

    result.current.run('a')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('a')

    result.current.run('b')
    result.current.run('c')
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('c')
    vi.useRealTimers()
  })

  it('should support leading edge only', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() =>
      useThrottleFn(fn, 200, { edges: ['leading'] }),
    )

    result.current.run(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith(1)

    result.current.run(2)
    result.current.run(3)
    vi.advanceTimersByTime(200)

    // no trailing call when only leading
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('should support trailing edge only', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() =>
      useThrottleFn(fn, 200, { edges: ['trailing'] }),
    )

    result.current.run('x')
    expect(fn).not.toHaveBeenCalled()

    result.current.run('y')
    result.current.run('z')
    vi.advanceTimersByTime(200)

    // trailing should fire once with last args
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('z')
    vi.useRealTimers()
  })

  it('should support leading and trailing edges', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() =>
      useThrottleFn(fn, 200, { edges: ['leading', 'trailing'] }),
    )

    result.current.run('x')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('x')

    result.current.run('y')
    result.current.run('z')
    vi.advanceTimersByTime(200)

    // trailing should fire once with last args
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('z')
    vi.useRealTimers()
  })

  it('should throttle multiple calls within the time window', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottleFn(fn, 200))

    result.current.run(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith(1)

    vi.advanceTimersByTime(100)
    result.current.run(2)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    result.current.run(3)
    // At 200ms, trailing edge executes with the last args (3)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith(3)

    // New throttle window starts after trailing edge
    result.current.run(4)
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(3)
    expect(fn).toHaveBeenLastCalledWith(4)
    vi.useRealTimers()
  })

  it('should pass all arguments to the function', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottleFn(fn, 100))

    result.current.run(1, 'a', { k: 3 })
    expect(fn).toHaveBeenCalledWith(1, 'a', { k: 3 })
    vi.useRealTimers()
  })

  it('should cancel pending call', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottleFn(fn, 150))

    result.current.run('first')
    expect(fn).toHaveBeenCalledTimes(1)

    result.current.run('pending')
    result.current.cancel()
    vi.advanceTimersByTime(200)

    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('should flush pending call immediately', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottleFn(fn, 150))

    result.current.run('first')
    expect(fn).toHaveBeenCalledTimes(1)

    result.current.run('flush-me')
    result.current.flush()

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('flush-me')

    // no extra call after time passes
    vi.advanceTimersByTime(150)
    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('should cancel on unmount', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result, unmount } = renderHook(() => useThrottleFn(fn, 100))

    result.current.run('first')
    expect(fn).toHaveBeenCalledTimes(1)

    result.current.run('bye')
    unmount()
    vi.advanceTimersByTime(200)

    // leading edge already fired, trailing should be cancelled
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('should use default throttleMs of 1000 when not provided', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useThrottleFn(fn))

    result.current.run('a')
    expect(fn).toHaveBeenCalledTimes(1)

    result.current.run('b')
    result.current.run('c')
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1000)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('c')
    vi.useRealTimers()
  })
})
