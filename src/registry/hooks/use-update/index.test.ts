import { act, renderHook } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useUpdate } from './index'

describe('useUpdate', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useUpdate())

    expect(typeof result.current).toBe('function')
  })

  it('should return the same function reference on each render', () => {
    const { result, rerender } = renderHook(() => useUpdate())
    const firstUpdate = result.current

    rerender()
    const secondUpdate = result.current

    expect(firstUpdate).toBe(secondUpdate)
  })

  it('should trigger a re-render when called', () => {
    let renderCount = 0
    const { result } = renderHook(() => {
      renderCount++
      return useUpdate()
    })

    expect(renderCount).toBe(1)

    act(() => {
      result.current()
    })

    expect(renderCount).toBe(2)

    act(() => {
      result.current()
    })

    expect(renderCount).toBe(3)
  })

  it('should work with multiple calls', () => {
    let renderCount = 0
    const { result } = renderHook(() => {
      renderCount++
      return useUpdate()
    })

    expect(renderCount).toBe(1)

    act(() => {
      result.current()
      result.current()
      result.current()
    })

    expect(renderCount).toBe(2) // Only one re-render despite multiple calls
  })

  it('should work in a component with state', () => {
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0)
      const update = useUpdate()

      return { count, setCount, update }
    })

    expect(result.current.count).toBe(0)

    act(() => {
      result.current.setCount(5)
    })

    expect(result.current.count).toBe(5)

    act(() => {
      result.current.update()
    })

    expect(result.current.count).toBe(5) // State should remain the same
  })

  it('should work with useEffect', () => {
    const effectSpy = vi.fn()

    const { result } = renderHook(() => {
      const update = useUpdate()

      useEffect(() => {
        effectSpy()
      })

      return update
    })

    expect(effectSpy).toHaveBeenCalledTimes(1)

    act(() => {
      result.current()
    })

    expect(effectSpy).toHaveBeenCalledTimes(2)
  })
})
