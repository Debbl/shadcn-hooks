import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounceEffect } from './index'

describe('useDebounceEffect', () => {
  const DEBOUNCE_MS = 200

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('debounces effect calls and runs once after the delay', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep }) => useDebounceEffect(effect, [dep], DEBOUNCE_MS),
      { initialProps: { dep: 0 } },
    )

    // burst of rapid dep changes before the debounce window elapses
    act(() => {
      rerender({ dep: 1 })
      rerender({ dep: 2 })
      rerender({ dep: 3 })
    })

    // nothing yet
    expect(effect).toHaveBeenCalledTimes(0)

    // advance just before threshold
    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS - 1)
    })
    expect(effect).toHaveBeenCalledTimes(0)

    // cross the threshold
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('supports leading edge: runs immediately and not again later', () => {
    const effect = vi.fn()

    renderHook(
      ({ dep }) =>
        useDebounceEffect(effect, [dep], DEBOUNCE_MS, { edges: ['leading'] }),
      { initialProps: { dep: 0 } },
    )

    // runs immediately on leading
    expect(effect).toHaveBeenCalledTimes(1)

    // not called again at trailing edge
    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS + 10)
    })
    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('supports leading and trailing edges: runs twice', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep }) =>
        useDebounceEffect(effect, [dep], DEBOUNCE_MS, {
          edges: ['leading', 'trailing'],
        }),
      { initialProps: { dep: 0 } },
    )

    // leading call
    expect(effect).toHaveBeenCalledTimes(1)

    act(() => {
      rerender({ dep: 1 })
      vi.advanceTimersByTime(DEBOUNCE_MS + 10)
    })

    // trailing call
    expect(effect).toHaveBeenCalledTimes(2)
  })

  it('runs cleanup before next effect when debounced cycles execute', () => {
    const cleanup = vi.fn()
    const effect = vi.fn().mockImplementation(() => cleanup)

    const { rerender } = renderHook(
      ({ dep }) => useDebounceEffect(effect, [dep], DEBOUNCE_MS),
      { initialProps: { dep: 0 } },
    )

    // first cycle executes after debounce
    act(() => {
      rerender({ dep: 1 })
      vi.advanceTimersByTime(DEBOUNCE_MS + 10)
    })
    expect(effect).toHaveBeenCalledTimes(1)
    expect(cleanup).not.toHaveBeenCalled()

    // trigger another cycle
    act(() => {
      rerender({ dep: 1 })
      vi.advanceTimersByTime(DEBOUNCE_MS)
    })

    // cleanup from previous effect should run before next effect
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(effect).toHaveBeenCalledTimes(2)
  })
})
