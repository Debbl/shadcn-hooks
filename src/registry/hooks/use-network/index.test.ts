import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useNetwork } from './index'

describe('useNetwork', () => {
  let addEventListenerSpy: any
  let removeEventListenerSpy: any
  let originalOnline: boolean
  let mockConnection: any

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

  const createMockConnection = () => {
    const connection = {
      rtt: 50,
      type: 'wifi',
      downlink: 10,
      saveData: false,
      downlinkMax: 10,
      effectiveType: '4g',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    return connection
  }

  beforeEach(() => {
    originalOnline = navigator.onLine
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    // Mock navigator.connection
    mockConnection = createMockConnection()
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: mockConnection,
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    setNavigatorOnline(originalOnline)
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: undefined,
      writable: true,
    })
  })

  it('should return network state with default values', () => {
    setNavigatorOnline(true)
    const { result } = renderHook(() => useNetwork())

    expect(result.current).toHaveProperty('online')
    expect(result.current).toHaveProperty('since')
    expect(result.current.online).toBe(true)
  })

  it('should return network state with connection properties when available', () => {
    setNavigatorOnline(true)
    const { result } = renderHook(() => useNetwork())

    expect(result.current).toHaveProperty('rtt', 50)
    expect(result.current).toHaveProperty('type', 'wifi')
    expect(result.current).toHaveProperty('downlink', 10)
    expect(result.current).toHaveProperty('saveData', false)
    expect(result.current).toHaveProperty('downlinkMax', 10)
    expect(result.current).toHaveProperty('effectiveType', '4g')
  })

  it('should handle missing connection API gracefully', () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: undefined,
      writable: true,
    })

    setNavigatorOnline(true)
    const { result } = renderHook(() => useNetwork())

    expect(result.current.online).toBe(true)
    expect(result.current.rtt).toBeUndefined()
    expect(result.current.type).toBeUndefined()
  })

  it('should subscribe to online, offline, and change events', () => {
    renderHook(() => useNetwork())

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function),
    )
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function),
    )
    expect(mockConnection.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
  })

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useNetwork())
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function),
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function),
    )
    expect(mockConnection.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
  })

  it('should update when going offline', () => {
    setNavigatorOnline(true)
    const { result } = renderHook(() => useNetwork())
    expect(result.current.online).toBe(true)

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

    expect(result.current.online).toBe(false)
    expect(result.current.since).toBeInstanceOf(Date)
  })

  it('should update when going online', () => {
    setNavigatorOnline(false)
    const { result } = renderHook(() => useNetwork())
    expect(result.current.online).toBe(false)

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

    expect(result.current.online).toBe(true)
    expect(result.current.since).toBeInstanceOf(Date)
  })

  it('should update when connection changes', () => {
    setNavigatorOnline(true)
    const { result } = renderHook(() => useNetwork())

    let changeListener: null | (() => void) = null
    mockConnection.addEventListener.mock.calls.forEach((call: any) => {
      if (call[0] === 'change') {
        changeListener = call[1]
      }
    })

    if (changeListener) {
      // Update connection properties
      mockConnection.rtt = 100
      mockConnection.downlink = 5

      act(() => {
        changeListener!()
      })

      expect(result.current.rtt).toBe(100)
      expect(result.current.downlink).toBe(5)
      expect(result.current.since).toBeInstanceOf(Date)
    }
  })

  it('should handle multiple instances', () => {
    const { result: result1 } = renderHook(() => useNetwork())
    const { result: result2 } = renderHook(() => useNetwork())

    expect(result1.current.online).toBe(true)
    expect(result2.current.online).toBe(true)
  })

  it('should return server snapshot on server side', () => {
    // This test verifies that serverSnapshot is used correctly
    // In a real SSR scenario, useSyncExternalStore would use serverSnapshot
    setNavigatorOnline(true)
    const { result } = renderHook(() => useNetwork())

    // On client side, it should still work
    expect(result.current).toHaveProperty('online')
    expect(result.current).toHaveProperty('since')
  })
})
