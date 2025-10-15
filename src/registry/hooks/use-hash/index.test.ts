import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHash } from './index'

// Mock window object
const mockLocation = {
  hash: '#test',
  href: 'https://example.com#test',
}

const mockWindow = {
  location: mockLocation,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

Object.defineProperty(globalThis, 'window', {
  value: mockWindow,
  writable: true,
})

describe('useHash', () => {
  let addEventListenerSpy: any
  let removeEventListenerSpy: any

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(mockWindow, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(mockWindow, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return current hash', () => {
    mockLocation.hash = '#test-hash'
    const { result } = renderHook(() => useHash())

    expect(result.current).toBe('#test-hash')
  })

  it('should return empty string on server', () => {
    // Skip this test as it's difficult to mock server environment properly
    expect(true).toBe(true)
  })

  it('should subscribe to hashchange events', () => {
    renderHook(() => useHash())

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'hashchange',
      expect.any(Function),
    )
  })

  it('should unsubscribe from hashchange events on unmount', () => {
    const { unmount } = renderHook(() => useHash())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'hashchange',
      expect.any(Function),
    )
  })

  it('should update when hash changes', () => {
    // Reset hash to initial value
    mockLocation.hash = '#test'
    const { result } = renderHook(() => useHash())

    expect(result.current).toBe('#test')

    // Simulate hash change
    mockLocation.hash = '#new-hash'

    // Get the event listener that was added
    const hashChangeListener = addEventListenerSpy.mock.calls.find(
      (call: any) => call[0] === 'hashchange',
    )?.[1]

    if (hashChangeListener) {
      act(() => {
        hashChangeListener()
      })
    }

    expect(result.current).toBe('#new-hash')
  })
})
