import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMemoizedFn } from './index'

describe('useMemoizedFn', () => {
  it('should return a stable function reference', () => {
    const mockFn = vi.fn()
    const { result, rerender } = renderHook(({ fn }) => useMemoizedFn(fn), {
      initialProps: { fn: mockFn },
    })

    const fn1 = result.current
    rerender({ fn: mockFn })
    const fn2 = result.current

    expect(fn1).toBe(fn2)
  })

  it('should call the latest function', () => {
    const mockFn1 = vi.fn()
    const mockFn2 = vi.fn()

    const { result, rerender } = renderHook(({ fn }) => useMemoizedFn(fn), {
      initialProps: { fn: mockFn1 },
    })

    result.current('test')

    expect(mockFn1).toHaveBeenCalledWith('test')
    expect(mockFn2).not.toHaveBeenCalled()

    rerender({ fn: mockFn2 })

    result.current('test2')

    expect(mockFn1).toHaveBeenCalledTimes(1)
    expect(mockFn2).toHaveBeenCalledWith('test2')
  })

  it('should pass all arguments to the function', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useMemoizedFn(mockFn))

    result.current('arg1', 'arg2', 'arg3')

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })

  it('should handle function with this context', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useMemoizedFn(mockFn))

    const context = { test: 'value' }
    result.current.call(context, 'arg1')

    expect(mockFn).toHaveBeenCalledWith('arg1')
  })

  it('should handle function that returns values', () => {
    const mockFn = vi.fn().mockReturnValue('test-result')
    const { result } = renderHook(() => useMemoizedFn(mockFn))

    const returnValue = result.current()

    expect(returnValue).toBe('test-result')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should handle function with different argument types', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useMemoizedFn(mockFn))

    result.current(1, { a: 2 }, [3, 4], true, null, undefined)

    expect(mockFn).toHaveBeenCalledWith(
      1,
      { a: 2 },
      [3, 4],
      true,
      null,
      undefined,
    )
  })

  it('should maintain function reference when input function changes', () => {
    const mockFn1 = vi.fn()
    const mockFn2 = vi.fn()

    const { result, rerender } = renderHook(({ fn }) => useMemoizedFn(fn), {
      initialProps: { fn: mockFn1 },
    })

    const fn1 = result.current

    rerender({ fn: mockFn2 })

    const fn2 = result.current

    expect(fn1).toBe(fn2)
  })

  it('should handle async functions', async () => {
    const mockFn = vi.fn().mockResolvedValue('async-result')
    const { result } = renderHook(() => useMemoizedFn(mockFn))

    const promise = result.current('test')

    expect(mockFn).toHaveBeenCalledWith('test')

    const result_value = await promise
    expect(result_value).toBe('async-result')
  })
})
