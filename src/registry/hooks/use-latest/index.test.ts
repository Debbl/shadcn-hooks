import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLatest } from './index'

describe('useLatest', () => {
  it('should return ref with initial value', () => {
    const initialValue = 'initial'
    const { result } = renderHook(() => useLatest(initialValue))

    expect(result.current.current).toBe(initialValue)
  })

  it('should update ref when value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 'initial' },
    })

    expect(result.current.current).toBe('initial')

    rerender({ value: 'updated' })

    expect(result.current.current).toBe('updated')
  })

  it('should maintain same ref reference', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 'initial' },
    })

    const ref1 = result.current
    rerender({ value: 'updated' })
    const ref2 = result.current

    expect(ref1).toBe(ref2)
  })

  it('should handle object values', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 2 }

    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: obj1 },
    })

    expect(result.current.current).toBe(obj1)

    rerender({ value: obj2 })

    expect(result.current.current).toBe(obj2)
  })

  it('should handle function values', () => {
    const fn1 = () => 'test1'
    const fn2 = () => 'test2'

    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: fn1 },
    })

    expect(result.current.current).toBe(fn1)

    rerender({ value: fn2 })

    expect(result.current.current).toBe(fn2)
  })

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: null },
    })

    expect(result.current.current).toBe(null)

    rerender({ value: undefined as any })

    expect(result.current.current).toBeUndefined()
  })

  it('should handle primitive values', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 42 },
    })

    expect(result.current.current).toBe(42)

    rerender({ value: 100 })

    expect(result.current.current).toBe(100)
  })
})
