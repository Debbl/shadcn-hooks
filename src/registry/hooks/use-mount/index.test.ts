import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMount } from './index'

describe('useMount', () => {
  it('should call function on mount', () => {
    const mockFn = vi.fn()
    renderHook(() => useMount(mockFn))

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should call cleanup function on unmount', () => {
    const mockCleanup = vi.fn()
    const mockFn = vi.fn(() => mockCleanup)

    const { unmount } = renderHook(() => useMount(mockFn))

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockCleanup).not.toHaveBeenCalled()

    unmount()

    expect(mockCleanup).toHaveBeenCalledTimes(1)
  })

  it('should handle async function', async () => {
    const mockFn = vi.fn()
    const asyncFn = vi.fn(async () => {
      mockFn()
    })

    renderHook(() => useMount(asyncFn))

    expect(asyncFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should handle async function with cleanup', async () => {
    const mockCleanup = vi.fn()
    const asyncFn = vi.fn(async () => {
      return mockCleanup
    })

    const { unmount } = renderHook(() => useMount(asyncFn))

    expect(asyncFn).toHaveBeenCalledTimes(1)
    expect(mockCleanup).not.toHaveBeenCalled()

    // Wait for async function to complete
    await new Promise((resolve) => setTimeout(resolve, 0))

    unmount()

    // Async functions don't return cleanup functions in useMount
    expect(mockCleanup).not.toHaveBeenCalled()
  })

  it('should not call function on rerender', () => {
    const mockFn = vi.fn()
    const { rerender } = renderHook(({ fn }) => useMount(fn), {
      initialProps: { fn: mockFn },
    })

    expect(mockFn).toHaveBeenCalledTimes(1)

    rerender({ fn: mockFn })

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should handle undefined function', () => {
    expect(() => {
      renderHook(() => useMount(undefined as any))
    }).not.toThrow()
  })
})
