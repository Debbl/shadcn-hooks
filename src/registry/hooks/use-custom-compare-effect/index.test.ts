import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCustomCompareEffect } from './index'

describe('useCustomCompareEffect', () => {
  it('should run effect on mount', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn(() => false)

    renderHook(() => useCustomCompareEffect(mockEffect, [], customCompare))

    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(customCompare).toHaveBeenCalledTimes(1)
  })

  it('should not run effect when custom compare returns true', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn(
      (a, b) => JSON.stringify(a) === JSON.stringify(b),
    )
    const deps = [{ a: 1, b: 2 }]

    const { rerender } = renderHook(
      ({ deps }) => useCustomCompareEffect(mockEffect, deps, customCompare),
      { initialProps: { deps } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(customCompare).toHaveBeenCalledTimes(1)

    // Same content, custom compare returns true, should not run
    rerender({ deps: [{ a: 1, b: 2 }] })
    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(customCompare).toHaveBeenCalledTimes(2)
  })

  it('should run effect when custom compare returns false', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn((_a, _b) => false) // Always return false
    const deps1 = [{ a: 1, b: 2 }]
    const deps2 = [{ a: 1, b: 2 }] // Same content but custom compare returns false

    const { rerender } = renderHook(
      ({ deps }) => useCustomCompareEffect(mockEffect, deps, customCompare),
      { initialProps: { deps: deps1 } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(customCompare).toHaveBeenCalledTimes(1)

    rerender({ deps: deps2 })
    expect(mockEffect).toHaveBeenCalledTimes(2)
    expect(customCompare).toHaveBeenCalledTimes(2)
  })

  it('should run cleanup function', () => {
    const mockCleanup = vi.fn()
    const mockEffect = vi.fn(() => mockCleanup)
    const customCompare = vi.fn(() => false)

    const { unmount } = renderHook(() =>
      useCustomCompareEffect(mockEffect, [], customCompare),
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(mockCleanup).not.toHaveBeenCalled()

    unmount()

    expect(mockCleanup).toHaveBeenCalledTimes(1)
  })

  it('should handle custom compare function that checks specific properties', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn((a, b) => {
      // Only compare the 'id' property
      return a[0]?.id === b[0]?.id
    })

    const deps1 = [{ id: 1, name: 'John', age: 30 }]
    const deps2 = [{ id: 1, name: 'Jane', age: 25 }] // Same id, different other props

    const { rerender } = renderHook(
      ({ deps }) => useCustomCompareEffect(mockEffect, deps, customCompare),
      { initialProps: { deps: deps1 } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)

    // Same id, should not run
    rerender({ deps: deps2 })
    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(customCompare).toHaveBeenCalledWith(deps1, deps2)
  })

  it('should handle custom compare function that checks array length', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn((a, b) => a.length === b.length)

    const deps1 = [1, 2, 3]
    const deps2 = [4, 5, 6] // Same length, different values

    const { rerender } = renderHook(
      ({ deps }) => useCustomCompareEffect(mockEffect, deps, customCompare),
      { initialProps: { deps: deps1 } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)

    // Same length, should not run
    rerender({ deps: deps2 })
    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should handle custom compare function that checks sum of numbers', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn((a, b) => {
      const sumA = a.reduce(
        (acc: number, val: number) => acc + (typeof val === 'number' ? val : 0),
        0,
      )
      const sumB = b.reduce(
        (acc: number, val: number) => acc + (typeof val === 'number' ? val : 0),
        0,
      )
      return sumA === sumB
    })

    const deps1 = [1, 2, 3] // Sum: 6
    const deps2 = [2, 2, 2] // Sum: 6

    const { rerender } = renderHook(
      ({ deps }) => useCustomCompareEffect(mockEffect, deps, customCompare),
      { initialProps: { deps: deps1 } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)

    // Same sum, should not run
    rerender({ deps: deps2 })
    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should handle empty dependencies array', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn(() => true)

    const { rerender } = renderHook(() =>
      useCustomCompareEffect(mockEffect, [], customCompare),
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(customCompare).toHaveBeenCalledTimes(1)

    // Empty array rerender
    rerender()
    expect(mockEffect).toHaveBeenCalledTimes(1)
    expect(customCompare).toHaveBeenCalledTimes(2)
  })

  it('should handle custom compare function that throws error gracefully', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn(() => {
      throw new Error('Custom compare error')
    })

    expect(() => {
      renderHook(() =>
        useCustomCompareEffect(mockEffect, [1, 2, 3], customCompare),
      )
    }).toThrow('Custom compare error')
  })

  it('should handle custom compare function with different parameter types', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn((a, b) => {
      // Compare first element of arrays
      return a[0] === b[0]
    })

    const deps1 = ['hello', 'world']
    const deps2 = ['hello', 'universe'] // Same first element

    const { rerender } = renderHook(
      ({ deps }) => useCustomCompareEffect(mockEffect, deps, customCompare),
      { initialProps: { deps: deps1 } },
    )

    expect(mockEffect).toHaveBeenCalledTimes(1)

    // Same first element, should not run
    rerender({ deps: deps2 })
    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should handle undefined dependencies gracefully', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn(() => false)

    expect(() => {
      renderHook(() =>
        useCustomCompareEffect(mockEffect, undefined as any, customCompare),
      )
    }).not.toThrow()

    expect(mockEffect).toHaveBeenCalledTimes(1)
  })

  it('should handle null dependencies gracefully', () => {
    const mockEffect = vi.fn()
    const customCompare = vi.fn(() => false)

    expect(() => {
      renderHook(() =>
        useCustomCompareEffect(mockEffect, null as any, customCompare),
      )
    }).not.toThrow()

    expect(mockEffect).toHaveBeenCalledTimes(1)
  })
})
