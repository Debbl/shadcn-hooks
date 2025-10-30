import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useUpdateEffect } from './index'

describe('useUpdateEffect', () => {
  it('should not run effect on initial mount', () => {
    const effect = vi.fn()

    renderHook(() => useUpdateEffect(effect, []))

    expect(effect).not.toHaveBeenCalled()
  })

  it('should run effect when deps update', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      {
        initialProps: { dep: 0 },
      },
    )

    expect(effect).not.toHaveBeenCalled()

    rerender({ dep: 1 })

    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('should run cleanup before next effect call on dep change', () => {
    const cleanup = vi.fn()
    const effect = vi.fn().mockImplementation(() => cleanup)

    const { rerender, unmount } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      { initialProps: { dep: 0 } },
    )

    // mount: no call
    expect(effect).not.toHaveBeenCalled()

    // first update triggers effect
    act(() => {
      rerender({ dep: 1 })
    })
    expect(effect).toHaveBeenCalledTimes(1)
    expect(cleanup).not.toHaveBeenCalled()

    // next update triggers cleanup then effect again
    act(() => {
      rerender({ dep: 2 })
    })
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(effect).toHaveBeenCalledTimes(2)

    // unmount should trigger last cleanup
    act(() => {
      unmount()
    })
    expect(cleanup).toHaveBeenCalledTimes(2)
  })

  it('should not run effect if deps do not change across rerenders', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(() => useUpdateEffect(effect, [1]))

    expect(effect).not.toHaveBeenCalled()

    rerender()
    rerender()

    expect(effect).not.toHaveBeenCalled()
  })

  it('should work with multiple dependencies', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ a, b }) => useUpdateEffect(effect, [a, b]),
      { initialProps: { a: 0, b: 0 } },
    )

    expect(effect).not.toHaveBeenCalled()

    // change a
    rerender({ a: 1, b: 0 })
    expect(effect).toHaveBeenCalledTimes(1)

    // change b
    rerender({ a: 1, b: 2 })
    expect(effect).toHaveBeenCalledTimes(2)

    // no change
    rerender({ a: 1, b: 2 })
    expect(effect).toHaveBeenCalledTimes(2)
  })
})
