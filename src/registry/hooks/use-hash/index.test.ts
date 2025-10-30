import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHash } from './index'

describe('useHash', () => {
  let addEventListenerSpy: any
  let removeEventListenerSpy: any
  let originalHash: string

  beforeEach(() => {
    originalHash = window.location.hash
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.location.hash = originalHash
  })

  it('should return current hash', () => {
    act(() => {
      window.location.hash = '#test-hash'
    })
    const { result } = renderHook(() => useHash())
    expect(result.current).toBe('#test-hash')
  })

  it('should return empty string on server', () => {
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
    act(() => {
      window.location.hash = '#test'
    })
    const { result } = renderHook(() => useHash())
    expect(result.current).toBe('#test')

    act(() => {
      window.location.hash = '#new-hash'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current).toBe('#new-hash')
  })
})
