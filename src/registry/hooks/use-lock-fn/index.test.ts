import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useLockFn } from './index'

describe('useLockFn', () => {
  it('should execute function normally when not locked', async () => {
    const mockFn = vi.fn().mockResolvedValue('result')
    const { result } = renderHook(() => useLockFn(mockFn))

    const result1 = await result.current()
    const result2 = await result.current()

    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(result1).toBe('result')
    expect(result2).toBe('result')
  })

  it('should lock function during execution', async () => {
    let resolvePromise: (value: string) => void
    const promise = new Promise<string>((resolve) => {
      resolvePromise = resolve
    })

    const mockFn = vi.fn().mockReturnValue(promise)
    const { result } = renderHook(() => useLockFn(mockFn))

    const promise1 = result.current()
    const promise2 = result.current()

    expect(mockFn).toHaveBeenCalledTimes(1)

    resolvePromise!('result')
    await promise1
    await promise2

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should handle function errors', async () => {
    const error = new Error('Test error')
    const mockFn = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useLockFn(mockFn))

    await expect(result.current()).rejects.toThrow('Test error')
    expect(mockFn).toHaveBeenCalledTimes(1)

    // Should be able to call again after error
    mockFn.mockResolvedValue('success')
    const result2 = await result.current()
    expect(result2).toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should pass arguments to function', async () => {
    const mockFn = vi.fn().mockResolvedValue('result')
    const { result } = renderHook(() => useLockFn(mockFn))

    await result.current('arg1', 'arg2')

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should maintain function reference stability', () => {
    const mockFn = vi.fn().mockResolvedValue('result')
    const { result, rerender } = renderHook(() => useLockFn(mockFn))

    const fn1 = result.current
    rerender()
    const fn2 = result.current

    expect(fn1).toBe(fn2)
  })
})
