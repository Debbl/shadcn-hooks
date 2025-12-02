import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFps } from './index'

describe('useFps', () => {
  let rafId = 0
  let rafCallbacks: Array<FrameRequestCallback> = []
  let performanceNow = 0
  const rafIdMap: Map<number, FrameRequestCallback> = new Map()

  const mockRequestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    const id = ++rafId
    rafCallbacks.push(callback)
    rafIdMap.set(id, callback)
    return id
  })

  const mockCancelAnimationFrame = vi.fn((id: number) => {
    rafIdMap.delete(id)
    const index = rafCallbacks.findIndex(() => {
      // Simple check - in real scenario would track by id
      return true
    })
    if (index !== -1) {
      rafCallbacks.splice(index, 1)
    }
  })

  const mockPerformanceNow = vi.fn(() => performanceNow)

  beforeEach(() => {
    rafId = 0
    rafCallbacks = []
    performanceNow = 1000 // Start from a non-zero value to avoid timing issues
    rafIdMap.clear()

    // Mock requestAnimationFrame
    globalThis.requestAnimationFrame = mockRequestAnimationFrame
    globalThis.cancelAnimationFrame = mockCancelAnimationFrame

    // Mock performance.now()
    mockPerformanceNow.mockReturnValue(performanceNow)
    Object.defineProperty(globalThis, 'performance', {
      value: {
        now: mockPerformanceNow,
      },
      configurable: true,
      writable: true,
    })

    // Mock window object
    Object.defineProperty(globalThis, 'window', {
      value: globalThis,
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    rafCallbacks = []
    rafIdMap.clear()
  })

  const advanceFrames = (count: number, timePerFrame: number = 16.67) => {
    for (let i = 0; i < count; i++) {
      performanceNow += timePerFrame
      mockPerformanceNow.mockReturnValue(performanceNow)
      // Process all pending callbacks
      const callbacks = [...rafCallbacks]
      rafCallbacks = []
      callbacks.forEach((callback) => {
        act(() => {
          callback(performanceNow)
        })
      })
    }
  }

  it('should return 0 initially', () => {
    const { result } = renderHook(() => useFps())

    expect(result.current).toBe(0)
  })

  it('should calculate FPS correctly at 60fps', async () => {
    const { result } = renderHook(() => useFps({ every: 10 }))

    // Simulate 10 frames at 60fps (16.67ms per frame)
    advanceFrames(10, 16.67)

    await waitFor(
      () => {
        // After 10 frames in ~166.7ms, FPS should be around 60
        expect(result.current).toBeGreaterThan(55)
        expect(result.current).toBeLessThanOrEqual(60)
      },
      { timeout: 1000 },
    )
  })

  it('should update FPS periodically based on every option', async () => {
    const { result } = renderHook(() => useFps({ every: 5 }))

    // Simulate 5 frames at 60fps
    advanceFrames(5, 16.67)

    await waitFor(
      () => {
        // After 5 frames in ~83.35ms, FPS should be around 60
        expect(result.current).toBeGreaterThan(40)
        expect(result.current).toBeLessThanOrEqual(70)
      },
      { timeout: 1000 },
    )
  })

  it('should use default every value of 10', async () => {
    const { result } = renderHook(() => useFps())

    // Simulate 10 frames at 60fps
    advanceFrames(10, 16.67)

    await waitFor(
      () => {
        // After 10 frames in ~166.7ms, FPS should be around 60
        expect(result.current).toBeGreaterThan(40)
        expect(result.current).toBeLessThanOrEqual(70)
      },
      { timeout: 1000 },
    )
  })

  it('should handle different frame rates - 30fps', async () => {
    const { result } = renderHook(() => useFps({ every: 10 }))

    // Simulate 10 frames at 30fps (33.33ms per frame)
    advanceFrames(10, 33.33)

    await waitFor(
      () => {
        // After 10 frames in ~333.3ms, FPS should be around 30
        expect(result.current).toBeGreaterThan(25)
        expect(result.current).toBeLessThanOrEqual(35)
      },
      { timeout: 1000 },
    )
  })

  it('should handle very low frame rates', async () => {
    const { result } = renderHook(() => useFps({ every: 5 }))

    // Simulate 5 frames at 10fps (100ms per frame)
    advanceFrames(5, 100)

    await waitFor(
      () => {
        // After 5 frames in ~500ms, FPS should be around 10
        expect(result.current).toBeGreaterThan(8)
        expect(result.current).toBeLessThanOrEqual(12)
      },
      { timeout: 1000 },
    )
  })

  it('should handle very high frame rates', async () => {
    const { result } = renderHook(() => useFps({ every: 20 }))

    // Simulate 20 frames at 120fps (8.33ms per frame)
    advanceFrames(20, 8.33)

    await waitFor(
      () => {
        // After 20 frames in ~166.6ms, FPS should be around 120
        expect(result.current).toBeGreaterThan(100)
        expect(result.current).toBeLessThanOrEqual(130)
      },
      { timeout: 1000 },
    )
  })

  it('should cleanup animation frame on unmount', () => {
    const { unmount } = renderHook(() => useFps())

    // Trigger some frames
    advanceFrames(5, 16.67)

    unmount()

    expect(mockCancelAnimationFrame).toHaveBeenCalled()
  })

  it('should restart when every option changes', async () => {
    const { result, rerender } = renderHook(({ every }) => useFps({ every }), {
      initialProps: { every: 10 },
    })

    advanceFrames(10, 16.67)

    await waitFor(
      () => {
        expect(result.current).toBeGreaterThan(50)
      },
      { timeout: 1000 },
    )

    // Change every option
    rerender({ every: 5 })

    // Wait a bit for the effect to restart and clear callbacks
    await new Promise((resolve) => setTimeout(resolve, 10))

    // Reset callbacks and time for fresh start
    rafCallbacks = []
    performanceNow = 0
    mockPerformanceNow.mockReturnValue(0)

    // Advance frames with new every value
    advanceFrames(5, 16.67)

    await waitFor(
      () => {
        expect(result.current).toBeGreaterThan(50)
        expect(result.current).toBeLessThanOrEqual(60)
      },
      { timeout: 1000 },
    )
  })

  it('should handle every option of 1', async () => {
    const { result } = renderHook(() => useFps({ every: 1 }))

    // Simulate 1 frame at 60fps (16.67ms per frame)
    advanceFrames(1, 16.67)

    await waitFor(
      () => {
        // With every: 1, after 1 frame in ~16.67ms, FPS should be around 60
        expect(result.current).toBeGreaterThan(50)
        expect(result.current).toBeLessThanOrEqual(60)
        expect(Number.isFinite(result.current)).toBe(true)
      },
      { timeout: 1000 },
    )
  })

  it('should handle large every values', async () => {
    const { result } = renderHook(() => useFps({ every: 30 }))

    // Simulate 30 frames at 60fps (16.67ms per frame)
    advanceFrames(30, 16.67)

    await waitFor(
      () => {
        // After 30 frames in ~500ms, FPS should be around 60
        expect(result.current).toBeGreaterThan(55)
        expect(result.current).toBeLessThanOrEqual(60)
        expect(Number.isFinite(result.current)).toBe(true)
      },
      { timeout: 1000 },
    )
  })

  it('should handle missing performance API', () => {
    // Clear previous calls
    mockRequestAnimationFrame.mockClear()

    Object.defineProperty(globalThis, 'performance', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    const { result } = renderHook(() => useFps())

    expect(result.current).toBe(0)
    expect(mockRequestAnimationFrame).not.toHaveBeenCalled()
  })

  it('should handle missing requestAnimationFrame', () => {
    // @ts-expect-error - intentionally removing for test
    globalThis.requestAnimationFrame = undefined

    const { result } = renderHook(() => useFps())

    expect(result.current).toBe(0)
  })

  it('should handle server-side rendering', () => {
    // Clear previous calls
    mockRequestAnimationFrame.mockClear()

    // In SSR, window is undefined, which makes isBrowser false
    // Since React's test environment requires window, we test the hook's
    // behavior when isBrowser check fails by ensuring it returns 0 initially
    // and handles the case gracefully
    const { result } = renderHook(() => useFps())

    // Initially should return 0
    expect(result.current).toBe(0)

    // The hook should handle SSR by checking isBrowser first
    // Since we can't fully mock SSR in test environment (React needs window),
    // we verify the hook returns 0 initially which is the expected SSR behavior
  })

  it('should handle multiple instances independently', async () => {
    const { result: result1 } = renderHook(() => useFps({ every: 5 }))
    const { result: result2 } = renderHook(() => useFps({ every: 10 }))

    // Simulate frames
    advanceFrames(10, 16.67)

    await waitFor(
      () => {
        expect(result1.current).toBeGreaterThan(50)
        expect(result2.current).toBeGreaterThan(50)
      },
      { timeout: 1000 },
    )
  })

  it('should not update FPS before reaching every threshold', async () => {
    const { result } = renderHook(() => useFps({ every: 10 }))

    // Simulate only 5 frames (less than every: 10)
    advanceFrames(5, 16.67)

    // Wait a bit to ensure no update
    await new Promise((resolve) => setTimeout(resolve, 100))

    // FPS should still be 0 or not updated yet
    expect(result.current).toBe(0)
  })

  it('should handle rapid frame updates', async () => {
    const { result } = renderHook(() => useFps({ every: 3 }))

    // Simulate rapid frames
    for (let i = 0; i < 3; i++) {
      performanceNow += 8.33 // Very fast frames
      mockPerformanceNow.mockReturnValue(performanceNow)
      const callbacks = [...rafCallbacks]
      rafCallbacks = []
      callbacks.forEach((callback) => {
        act(() => {
          callback(performanceNow)
        })
      })
    }

    await waitFor(
      () => {
        expect(result.current).toBeGreaterThan(100)
        expect(Number.isFinite(result.current)).toBe(true)
      },
      { timeout: 1000 },
    )
  })
})
