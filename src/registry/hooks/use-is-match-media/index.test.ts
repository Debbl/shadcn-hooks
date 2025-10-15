import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIsMatchMedia } from './index'

// Mock window.matchMedia
const mockMatchMedia = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
  writable: true,
})

describe('useIsMatchMedia', () => {
  let mockMediaQueryList: any

  beforeEach(() => {
    mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQueryList)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial match state', () => {
    mockMediaQueryList.matches = true
    const { result } = renderHook(() => useIsMatchMedia('(max-width: 768px)'))

    expect(result.current).toBe(true)
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 768px)')
  })

  it('should return false when media does not match', () => {
    mockMediaQueryList.matches = false
    const { result } = renderHook(() => useIsMatchMedia('(max-width: 768px)'))

    expect(result.current).toBe(false)
  })

  it('should subscribe to media query changes', () => {
    renderHook(() => useIsMatchMedia('(max-width: 768px)'))

    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
  })

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useIsMatchMedia('(max-width: 768px)'))

    unmount()

    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
  })

  it('should update when media query changes', () => {
    const { result } = renderHook(() => useIsMatchMedia('(max-width: 768px)'))

    expect(result.current).toBe(false)

    // Simulate media query change
    mockMediaQueryList.matches = true
    const changeListener = mockMediaQueryList.addEventListener.mock.calls[0][1]
    act(() => {
      changeListener({ matches: true })
    })

    expect(result.current).toBe(true)
  })

  it('should handle multiple media queries', () => {
    const { result: result1 } = renderHook(() =>
      useIsMatchMedia('(max-width: 768px)'),
    )
    const { result: result2 } = renderHook(() =>
      useIsMatchMedia('(min-width: 1024px)'),
    )

    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 768px)')
    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)')
    expect(result1.current).toBe(false)
    expect(result2.current).toBe(false)
  })

  it('should update when media query string changes', () => {
    const { rerender } = renderHook(({ query }) => useIsMatchMedia(query), {
      initialProps: { query: '(max-width: 768px)' },
    })

    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 768px)')

    rerender({ query: '(min-width: 1024px)' })

    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)')
  })
})
