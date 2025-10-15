import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDeepCompareEffect } from './index'

describe('useDeepCompareEffect', () => {
  it('should run effect on mount', () => {
    const mockEffect = vi.fn()
    renderHook(() => useDeepCompareEffect(mockEffect, []))

    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should not run effect when dependencies are shallowly equal', () => {
    const mockEffect = vi.fn()
    const deps = [{ a: 1, b: 2 }]

    const { rerender } = renderHook(
      ({ deps }) => useDeepCompareEffect(mockEffect, deps),
      { initialProps: { deps } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)

    // Same reference, should not run
    rerender({ deps })
    expect(mockEffect).toHaveBeenCalledTimes(1)

    // Different reference but same content, should not run
    rerender({ deps: [{ a: 1, b: 2 }] })
    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should run effect when dependencies are deeply different', () => {
    const mockEffect = vi.fn()
    const deps1 = [{ a: 1, b: 2 }]
    const deps2 = [{ a: 1, b: 3 }]

    const { rerender } = renderHook(
      ({ deps }) => useDeepCompareEffect(mockEffect, deps),
      { initialProps: { deps: deps1 } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)

    rerender({ deps: deps2 })
    expect(mockEffect).toHaveBeenCalledTimes(2)
  })

  it('should run cleanup function', () => {
    const mockCleanup = vi.fn()
    const mockEffect = vi.fn(() => mockCleanup)

    const { unmount } = renderHook(() => useDeepCompareEffect(mockEffect, []))

    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(mockCleanup).not.toHaveBeenCalled()

    unmount()

    expect(mockCleanup).toHaveBeenCalledTimes(1)
  })

  it('should handle complex nested objects', () => {
    const mockEffect = vi.fn()
    const deps1 = [{ user: { name: 'John', age: 30 }, items: [1, 2, 3] }]
    const deps2 = [{ user: { name: 'John', age: 30 }, items: [1, 2, 3] }]

    const { rerender } = renderHook(
      ({ deps }) => useDeepCompareEffect(mockEffect, deps),
      { initialProps: { deps: deps1 } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)

    // Same content, should not run
    rerender({ deps: deps2 })
    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should handle arrays with different order', () => {
    const mockEffect = vi.fn()
    const deps1 = [1, 2, 3]
    const deps2 = [3, 2, 1]

    const { rerender } = renderHook(
      ({ deps }) => useDeepCompareEffect(mockEffect, deps),
      { initialProps: { deps: deps1 } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)

    // Different order, should run
    rerender({ deps: deps2 })
    expect(mockEffect).toHaveBeenCalledTimes(2)
  })

  it('should handle undefined dependencies', () => {
    const mockEffect = vi.fn()

    expect(() => {
      renderHook(() => useDeepCompareEffect(mockEffect, undefined as any))
    }).not.toThrow()

    expect(mockEffect).toHaveBeenCalledTimes(1)
  })
})
