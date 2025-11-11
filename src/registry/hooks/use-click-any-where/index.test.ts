import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useClickAnyWhere } from './index'

describe('useClickAnyWhere', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should attach click event listener to window', () => {
    const handler = vi.fn()
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => {
      useClickAnyWhere(handler)
    })

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      {
        capture: undefined,
        once: undefined,
        passive: undefined,
      },
    )
    expect(handler).not.toHaveBeenCalled()

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      {
        capture: undefined,
      },
    )
  })

  it('should call handler when click event is triggered', () => {
    const handler = vi.fn()

    renderHook(() => {
      useClickAnyWhere(handler)
    })

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      clientX: 100,
      clientY: 200,
    })
    window.dispatchEvent(clickEvent)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(clickEvent)
  })

  it('should call handler multiple times for multiple clicks', () => {
    const handler = vi.fn()

    renderHook(() => {
      useClickAnyWhere(handler)
    })

    const clickEvent1 = new MouseEvent('click', { bubbles: true })
    const clickEvent2 = new MouseEvent('click', { bubbles: true })
    const clickEvent3 = new MouseEvent('click', { bubbles: true })

    window.dispatchEvent(clickEvent1)
    window.dispatchEvent(clickEvent2)
    window.dispatchEvent(clickEvent3)

    expect(handler).toHaveBeenCalledTimes(3)
  })

  it('should use latest handler when handler changes', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const { rerender } = renderHook(
      ({ handler }) => {
        useClickAnyWhere(handler)
      },
      {
        initialProps: { handler: handler1 },
      },
    )

    const clickEvent = new MouseEvent('click', { bubbles: true })
    window.dispatchEvent(clickEvent)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).not.toHaveBeenCalled()

    rerender({ handler: handler2 })

    window.dispatchEvent(clickEvent)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
  })

  it('should pass MouseEvent with correct properties', () => {
    const handler = vi.fn()

    renderHook(() => {
      useClickAnyWhere(handler)
    })

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      clientX: 150,
      clientY: 250,
      button: 0,
    })
    window.dispatchEvent(clickEvent)

    expect(handler).toHaveBeenCalledWith(clickEvent)
    expect(handler.mock.calls[0][0].clientX).toBe(150)
    expect(handler.mock.calls[0][0].clientY).toBe(250)
  })

  it('should remove listener on unmount', () => {
    const handler = vi.fn()
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => {
      useClickAnyWhere(handler)
    })

    const listener = addEventListenerSpy.mock.calls[0][1] as EventListener

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', listener, {
      capture: undefined,
    })

    // Verify handler is not called after unmount
    const clickEvent = new MouseEvent('click', { bubbles: true })
    window.dispatchEvent(clickEvent)

    expect(handler).not.toHaveBeenCalled()
  })
})
