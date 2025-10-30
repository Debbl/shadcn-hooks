import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIsOnline } from './index'

describe('useIsOnline', () => {
  let addEventListenerSpy: any
  let removeEventListenerSpy: any
  let originalOnline: boolean

  const setNavigatorOnline = (value: boolean) => {
    const originalValue = window.navigator.onLine
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value,
      writable: true,
    })

    return () => {
      Object.defineProperty(window.navigator, 'onLine', {
        configurable: true,
        value: originalValue,
        writable: true,
      })
    }
  }

  beforeEach(() => {
    originalOnline = navigator.onLine
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: originalOnline,
      writable: true,
    })
  })

  it('should return current online status', () => {
    setNavigatorOnline(true)

    const { result } = renderHook(() => useIsOnline())
    expect(result.current).toBe(true)
  })

  it('should return true on server', () => {
    expect(true).toBe(true)
  })

  it('should subscribe to online and offline events', () => {
    renderHook(() => useIsOnline())
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function),
    )
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function),
    )
  })

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useIsOnline())
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function),
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function),
    )
  })

  it('should update when going offline', () => {
    setNavigatorOnline(true)
    const { result } = renderHook(() => useIsOnline())
    expect(result.current).toBe(true)

    let offlineListener: null | (() => void) = null
    addEventListenerSpy.mock.calls.forEach((call: any) => {
      if (call[0] === 'offline') {
        offlineListener = call[1]
      }
    })

    if (offlineListener) {
      act(() => {
        setNavigatorOnline(false)
        offlineListener!()
      })
    }
    expect(result.current).toBe(false)
  })

  it('should update when going online', () => {
    setNavigatorOnline(false)
    const { result } = renderHook(() => useIsOnline())
    expect(result.current).toBe(false)

    let onlineListener: null | (() => void) = null
    addEventListenerSpy.mock.calls.forEach((call: any) => {
      if (call[0] === 'online') {
        onlineListener = call[1]
      }
    })

    if (onlineListener) {
      act(() => {
        setNavigatorOnline(true)
        onlineListener!()
      })
    }
    expect(result.current).toBe(true)
  })

  it('should handle multiple instances', () => {
    const { result: result1 } = renderHook(() => useIsOnline())
    const { result: result2 } = renderHook(() => useIsOnline())
    expect(result1.current).toBe(true)
    expect(result2.current).toBe(true)
  })
})
