import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useUnmount } from './index'

describe('useUnmount', () => {
  it('should call function on unmount', () => {
    const mockFn = vi.fn()
    const { unmount } = renderHook(() => useUnmount(mockFn))

    expect(mockFn).not.toHaveBeenCalled()

    unmount()

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should call latest function on unmount', () => {
    const mockFn1 = vi.fn()
    const mockFn2 = vi.fn()

    const { rerender, unmount } = renderHook(({ fn }) => useUnmount(fn), {
      initialProps: { fn: mockFn1 },
    })

    expect(mockFn1).not.toHaveBeenCalled()
    expect(mockFn2).not.toHaveBeenCalled()

    rerender({ fn: mockFn2 })

    unmount()

    expect(mockFn1).not.toHaveBeenCalled()
    expect(mockFn2).toHaveBeenCalledTimes(1)
  })

  it('should not call function on rerender', () => {
    const mockFn = vi.fn()
    const { rerender } = renderHook(({ fn }) => useUnmount(fn), {
      initialProps: { fn: mockFn },
    })

    expect(mockFn).not.toHaveBeenCalled()

    rerender({ fn: mockFn })

    expect(mockFn).not.toHaveBeenCalled()
  })
})
