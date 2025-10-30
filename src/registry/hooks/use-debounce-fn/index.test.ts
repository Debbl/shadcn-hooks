import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDebounceFn } from './index'

describe('useDebounceFn', () => {
  it('should debounce calls and run once on trailing edge by default', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useDebounceFn(fn, 200))

    result.current.run('a')
    result.current.run('b')
    result.current.run('c')

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(199)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('c')
    vi.useRealTimers()
  })

  it('should support leading edge only', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() =>
      useDebounceFn(fn, 200, { edges: ['leading'] }),
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

  it('should support leading and trailing edges', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() =>
      useDebounceFn(fn, 200, { edges: ['leading', 'trailing'] }),
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

  it('should pass all arguments to the function', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useDebounceFn(fn, 100))

    result.current.run(1, 'a', { k: 3 })
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith(1, 'a', { k: 3 })
    vi.useRealTimers()
  })

  it('should cancel pending call', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useDebounceFn(fn, 150))

    result.current.run('pending')
    result.current.cancel()
    vi.advanceTimersByTime(200)

    expect(fn).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('should flush pending call immediately', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result } = renderHook(() => useDebounceFn(fn, 150))

    result.current.run('now')
    result.current.flush()

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('now')

    // no extra call after time passes
    vi.advanceTimersByTime(150)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('should cancel on unmount (no trailing call)', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const { result, unmount } = renderHook(() => useDebounceFn(fn, 100))

    result.current.run('bye')
    unmount()
    vi.advanceTimersByTime(200)

    expect(fn).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
