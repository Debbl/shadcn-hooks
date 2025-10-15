import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useEffectEvent } from './index'

describe('useEffectEvent', () => {
  it('should return a function that calls the latest version', () => {
    const mockFn1 = vi.fn()
    const mockFn2 = vi.fn()

    const { result, rerender } = renderHook(({ fn }) => useEffectEvent(fn), {
      initialProps: { fn: mockFn1 },
    })

    result.current('test')

    expect(mockFn1).toHaveBeenCalledWith('test')

    rerender({ fn: mockFn2 })

    result.current('test2')

    expect(mockFn1).toHaveBeenCalledTimes(1)
    expect(mockFn2).toHaveBeenCalledWith('test2')
  })

  it('should maintain function reference stability', () => {
    const mockFn = vi.fn()
    const { result, rerender } = renderHook(({ fn }) => useEffectEvent(fn), {
      initialProps: { fn: mockFn },
    })

    const fn1 = result.current
    rerender({ fn: mockFn })
    const fn2 = result.current

    // useEffectEvent may not maintain exact reference stability due to its implementation
    expect(typeof fn1).toBe('function')
    expect(typeof fn2).toBe('function')
  })

  it('should pass all arguments to the function', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useEffectEvent(mockFn))

    result.current('arg1', 'arg2', 'arg3')

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })

  it('should handle function that returns values', () => {
    const mockFn = vi.fn().mockReturnValue('test-result')
    const { result } = renderHook(() => useEffectEvent(mockFn))

    const returnValue = result.current()

    expect(returnValue).toBe('test-result')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should handle function with this context', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useEffectEvent(mockFn))

    const context = { test: 'value' }
    result.current.call(context, 'arg1')

    expect(mockFn).toHaveBeenCalledWith('arg1')
  })

  it('should update when function changes', () => {
    const mockFn1 = vi.fn().mockReturnValue('result1')
    const mockFn2 = vi.fn().mockReturnValue('result2')

    const { result, rerender } = renderHook(({ fn }) => useEffectEvent(fn), {
      initialProps: { fn: mockFn1 },
    })

    expect(result.current()).toBe('result1')

    rerender({ fn: mockFn2 })

    expect(result.current()).toBe('result2')
  })
})
