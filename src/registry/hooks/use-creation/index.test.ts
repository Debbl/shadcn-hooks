import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCreation } from './index'

describe('useCreation', () => {
  it('should create value on initial render', () => {
    const factory = () => ({ value: 1, id: Math.random() })
    const { result } = renderHook(() => useCreation(factory, []))

    expect(result.current).toHaveProperty('value', 1)
    expect(result.current).toHaveProperty('id')
  })

  it('should return the same object when deps do not change', () => {
    const factory = () => ({ value: 1, id: Math.random() })
    const { result, rerender } = renderHook(
      ({ deps }) => useCreation(factory, deps),
      { initialProps: { deps: [1, 2] } },
    )

    const firstResult = result.current
    const firstId = firstResult.id

    // Rerender with same deps (by reference)
    rerender({ deps: [1, 2] })
    expect(result.current).toBe(firstResult)
    expect(result.current.id).toBe(firstId)

    // Rerender with same deps (by value, deep equal)
    rerender({ deps: [1, 2] })
    expect(result.current).toBe(firstResult)
    expect(result.current.id).toBe(firstId)
  })

  it('should recreate value when deps change', () => {
    let callCount = 0
    const factory = () => {
      callCount++
      return { value: callCount, id: Math.random() }
    }

    const { result, rerender } = renderHook(
      ({ deps }) => useCreation(factory, deps),
      { initialProps: { deps: [1] } },
    )

    const firstResult = result.current
    const firstId = firstResult.id
    expect(callCount).toBe(1)

    // Change deps
    rerender({ deps: [2] })
    expect(result.current).not.toBe(firstResult)
    expect(result.current.id).not.toBe(firstId)
    expect(callCount).toBe(2)
    expect(result.current.value).toBe(2)
  })

  it('should use deep comparison for deps', () => {
    let callCount = 0
    const factory = () => {
      callCount++
      return { value: callCount, id: Math.random() }
    }

    const deps1 = { a: 1, b: 2 }
    const deps2 = { a: 1, b: 2 } // Same content, different reference

    const { result, rerender } = renderHook(
      ({ deps }) => useCreation(factory, [deps]),
      { initialProps: { deps: deps1 } },
    )

    const firstResult = result.current
    expect(callCount).toBe(1)

    // Same content, should not recreate (deep equal)
    rerender({ deps: deps2 })
    expect(result.current).toBe(firstResult)
    expect(callCount).toBe(1)

    // Different content, should recreate
    rerender({ deps: { a: 2, b: 2 } })
    expect(result.current).not.toBe(firstResult)
    expect(callCount).toBe(2)
  })

  it('should handle empty deps array', () => {
    let callCount = 0
    const factory = () => {
      callCount++
      return { value: callCount }
    }

    const { result, rerender } = renderHook(() => useCreation(factory, []))

    const firstResult = result.current
    expect(callCount).toBe(1)

    // Rerender should not recreate
    rerender()
    expect(result.current).toBe(firstResult)
    expect(callCount).toBe(1)
  })

  it('should handle primitive values', () => {
    const factory = () => 42
    const { result } = renderHook(() => useCreation(factory, []))

    expect(result.current).toBe(42)
  })

  it('should handle array values', () => {
    const factory = () => [1, 2, 3]
    const { result, rerender } = renderHook(
      ({ deps }) => useCreation(factory, deps),
      { initialProps: { deps: [1] } },
    )

    const firstResult = result.current
    expect(Array.isArray(firstResult)).toBe(true)
    expect(firstResult).toEqual([1, 2, 3])

    // Same deps, should return same array
    rerender({ deps: [1] })
    expect(result.current).toBe(firstResult)

    // Different deps, should create new array
    rerender({ deps: [2] })
    expect(result.current).not.toBe(firstResult)
    expect(result.current).toEqual([1, 2, 3])
  })

  it('should handle nested object deps', () => {
    let callCount = 0
    const factory = () => {
      callCount++
      return { created: callCount }
    }

    const { result, rerender } = renderHook(
      ({ deps }) => useCreation(factory, [deps]),
      {
        initialProps: {
          deps: { user: { name: 'Alice', age: 20 } },
        },
      },
    )

    const firstResult = result.current
    expect(callCount).toBe(1)

    // Same nested structure, should not recreate
    rerender({
      deps: { user: { name: 'Alice', age: 20 } },
    })
    expect(result.current).toBe(firstResult)
    expect(callCount).toBe(1)

    // Different nested structure, should recreate
    rerender({
      deps: { user: { name: 'Bob', age: 20 } },
    })
    expect(result.current).not.toBe(firstResult)
    expect(callCount).toBe(2)
  })
})
