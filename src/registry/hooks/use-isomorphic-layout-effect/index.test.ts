import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useIsomorphicLayoutEffect } from './index'

describe('useIsomorphicLayoutEffect', () => {
  it('should be a function', () => {
    expect(typeof useIsomorphicLayoutEffect).toBe('function')
  })

  it('should handle effect without dependencies', () => {
    const mockEffect = vi.fn()

    renderHook(() => useIsomorphicLayoutEffect(mockEffect))

    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should handle effect with empty dependencies', () => {
    const mockEffect = vi.fn()

    renderHook(() => useIsomorphicLayoutEffect(mockEffect, []))

    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should handle effect with multiple dependencies', () => {
    const mockEffect = vi.fn()
    const deps = ['dep1', 'dep2', 'dep3']

    renderHook(() => useIsomorphicLayoutEffect(mockEffect, deps))

    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should handle cleanup function', () => {
    const mockCleanup = vi.fn()
    const mockEffect = vi.fn(() => mockCleanup)

    const { unmount } = renderHook(() =>
      useIsomorphicLayoutEffect(mockEffect, []),
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(mockCleanup).not.toHaveBeenCalled()

    unmount()

    expect(mockCleanup).toHaveBeenCalledTimes(1)
  })
})
