import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThrottleEffect } from './index'

describe('useThrottleEffect', () => {
  const THROTTLE_MS = 200

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should throttle effect calls and run on leading and trailing edges by default', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep }) => useThrottleEffect(effect, [dep], THROTTLE_MS),
      { initialProps: { dep: 0 } },
    )

    // Leading edge: should execute immediately
    expect(effect).toHaveBeenCalledTimes(1)

    // Rapid dep changes
    act(() => {
      rerender({ dep: 1 })
      vi.runOnlyPendingTimers()
    })
    // Leading edge should execute immediately
    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      rerender({ dep: 2 })
      rerender({ dep: 3 })
    })

    // Effect should not be called again yet (within throttle window)
    expect(effect).toHaveBeenCalledTimes(2)

    // Advance past throttle period
    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS)
    })
    // Trailing edge should execute
    expect(effect).toHaveBeenCalledTimes(3)
  })

  it('should support leading edge only', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep }) =>
        useThrottleEffect(effect, [dep], THROTTLE_MS, { edges: ['leading'] }),
      { initialProps: { dep: 0 } },
    )

    // Should execute immediately on leading edge
    expect(effect).toHaveBeenCalledTimes(1)

    act(() => {
      rerender({ dep: 1 })
      vi.runOnlyPendingTimers()
    })
    // Leading edge should execute immediately
    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      rerender({ dep: 2 })
      rerender({ dep: 3 })
    })

    // Effect should remain at 2 calls (no trailing call)
    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS + 10)
    })
    // Still should be 2 calls, no trailing update
    expect(effect).toHaveBeenCalledTimes(2)
  })

  it('should support trailing edge only', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep }) =>
        useThrottleEffect(effect, [dep], THROTTLE_MS, { edges: ['trailing'] }),
      { initialProps: { dep: 0 } },
    )

    // With trailing only, effect should not run on initial mount
    // The flag mechanism with useUpdateEffect means it won't run on mount
    expect(effect).toHaveBeenCalledTimes(0)

    act(() => {
      rerender({ dep: 1 })
    })
    // No leading edge with trailing-only option
    // However, the throttle mechanism may schedule a trailing call
    // But it shouldn't execute immediately
    expect(effect).toHaveBeenCalledTimes(0)

    act(() => {
      rerender({ dep: 2 })
      rerender({ dep: 3 })
    })

    // Should still be 0 (no leading, trailing not yet fired)
    expect(effect).toHaveBeenCalledTimes(0)

    // Advance past throttle period
    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS)
      vi.runOnlyPendingTimers()
    })
    // Trailing edge should execute
    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('should support leading and trailing edges', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep }) =>
        useThrottleEffect(effect, [dep], THROTTLE_MS, {
          edges: ['leading', 'trailing'],
        }),
      { initialProps: { dep: 0 } },
    )

    // Should execute immediately on leading edge
    expect(effect).toHaveBeenCalledTimes(1)

    act(() => {
      rerender({ dep: 1 })
      vi.runOnlyPendingTimers()
    })
    // Leading edge should execute immediately
    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      rerender({ dep: 2 })
      rerender({ dep: 3 })
    })

    // Should still be 2 calls (leading edge already fired)
    expect(effect).toHaveBeenCalledTimes(2)

    // Advance past throttle period
    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS + 10)
    })
    // Should execute on trailing edge
    expect(effect).toHaveBeenCalledTimes(3)
  })

  it('should throttle multiple calls within the time window', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep }) => useThrottleEffect(effect, [dep], THROTTLE_MS),
      { initialProps: { dep: 1 } },
    )

    // Leading edge executes immediately
    expect(effect).toHaveBeenCalledTimes(1)

    act(() => {
      rerender({ dep: 2 })
      vi.runOnlyPendingTimers()
    })
    // Leading edge executes immediately
    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    act(() => {
      rerender({ dep: 3 })
    })
    // Should still be 2 calls (within throttle window, no leading edge again)
    expect(effect).toHaveBeenCalledTimes(2)

    // Advance to trigger trailing edge
    act(() => {
      vi.advanceTimersByTime(100)
      vi.runOnlyPendingTimers()
    })
    // At 200ms total from first leading edge, trailing edge executes
    expect(effect).toHaveBeenCalledTimes(3)

    // New throttle window starts after trailing edge
    act(() => {
      rerender({ dep: 4 })
      vi.runOnlyPendingTimers()
    })
    // Leading edge fires immediately for dep: 4
    expect(effect).toHaveBeenCalledTimes(4)

    // Advance past throttle period
    // Note: With throttle, the trailing edge typically fires when there are
    // multiple changes within a throttle window. Since dep: 4 is the only
    // change in this window and the leading edge already fired, the trailing
    // edge may not fire again (depending on throttle implementation details)
    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS)
      vi.runOnlyPendingTimers()
    })
    // The trailing edge may not fire if only one change occurred and leading already fired
    expect(effect).toHaveBeenCalledTimes(4)
  })

  it('should handle multiple dependency changes', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep1, dep2 }) => useThrottleEffect(effect, [dep1, dep2], THROTTLE_MS),
      { initialProps: { dep1: 0, dep2: 0 } },
    )

    expect(effect).toHaveBeenCalledTimes(1)

    act(() => {
      rerender({ dep1: 1, dep2: 0 })
      vi.runOnlyPendingTimers()
    })
    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      rerender({ dep1: 1, dep2: 1 })
      rerender({ dep1: 2, dep2: 2 })
    })

    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS)
    })

    expect(effect).toHaveBeenCalledTimes(3)
  })

  it('should use default throttle time of 1000ms when not specified', () => {
    const effect = vi.fn()

    const { rerender } = renderHook(
      ({ dep }) => useThrottleEffect(effect, [dep]),
      {
        initialProps: { dep: 'a' },
      },
    )

    expect(effect).toHaveBeenCalledTimes(1)

    act(() => {
      rerender({ dep: 'b' })
      vi.runOnlyPendingTimers()
    })
    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      rerender({ dep: 'c' })
    })

    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(effect).toHaveBeenCalledTimes(2)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(effect).toHaveBeenCalledTimes(3)
  })

  it('should run cleanup before next effect when throttled cycles execute', () => {
    const cleanup = vi.fn()
    const effect = vi.fn().mockImplementation(() => cleanup)

    const { rerender } = renderHook(
      ({ dep }) => useThrottleEffect(effect, [dep], THROTTLE_MS),
      { initialProps: { dep: 0 } },
    )

    // First cycle executes on leading edge
    expect(effect).toHaveBeenCalledTimes(1)
    expect(cleanup).not.toHaveBeenCalled()

    // Trigger another cycle
    act(() => {
      rerender({ dep: 1 })
      vi.runOnlyPendingTimers()
    })

    // Cleanup from previous effect should run before next effect
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(effect).toHaveBeenCalledTimes(2)
  })

  it('should handle AbortSignal cancellation', () => {
    const effect = vi.fn()
    const controller = new AbortController()

    const { rerender, unmount } = renderHook(
      ({ dep }) =>
        useThrottleEffect(effect, [dep], THROTTLE_MS, {
          signal: controller.signal,
        }),
      { initialProps: { dep: 0 } },
    )

    expect(effect).toHaveBeenCalledTimes(1)

    act(() => {
      rerender({ dep: 1 })
      vi.runOnlyPendingTimers()
    })
    expect(effect).toHaveBeenCalledTimes(2)

    // Cancel the throttle
    act(() => {
      controller.abort()
      rerender({ dep: 2 })
    })

    // Advance time - effect should not be called due to cancellation
    act(() => {
      vi.advanceTimersByTime(THROTTLE_MS + 10)
    })
    expect(effect).toHaveBeenCalledTimes(2)

    unmount()
  })
})
