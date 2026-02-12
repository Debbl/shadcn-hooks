import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDocumentVisibility } from './index'

describe('useDocumentVisibility', () => {
  const setDocumentVisibilityState = (value: DocumentVisibilityState) => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => value,
    })
  }

  beforeEach(() => {
    setDocumentVisibilityState('visible')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    Reflect.deleteProperty(document, 'visibilityState')
  })

  it('should return current document visibility state', () => {
    setDocumentVisibilityState('hidden')
    const { result } = renderHook(() => useDocumentVisibility())

    expect(result.current).toBe('hidden')
  })

  it('should subscribe to visibilitychange events', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

    renderHook(() => useDocumentVisibility())

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
      { passive: true },
    )
  })

  it('should unsubscribe from visibilitychange events on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook(() => useDocumentVisibility())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    )
  })

  it('should update when visibility changes', () => {
    const { result } = renderHook(() => useDocumentVisibility())

    expect(result.current).toBe('visible')

    act(() => {
      setDocumentVisibilityState('hidden')
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(result.current).toBe('hidden')

    act(() => {
      setDocumentVisibilityState('visible')
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(result.current).toBe('visible')
  })

  it('should handle multiple instances', () => {
    const { result: result1 } = renderHook(() => useDocumentVisibility())
    const { result: result2 } = renderHook(() => useDocumentVisibility())

    expect(result1.current).toBe('visible')
    expect(result2.current).toBe('visible')
  })
})
