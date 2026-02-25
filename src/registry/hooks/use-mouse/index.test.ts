import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMouse } from './index'

interface TouchPointOptions {
  clientX?: number
  clientY?: number
  pageX?: number
  pageY?: number
  screenX?: number
  screenY?: number
}

function createTouchPoint(options: TouchPointOptions = {}): Touch {
  const clientX = options.clientX ?? 0
  const clientY = options.clientY ?? 0

  return {
    identifier: 1,
    target: document.body,
    clientX,
    clientY,
    pageX: options.pageX ?? clientX,
    pageY: options.pageY ?? clientY,
    screenX: options.screenX ?? clientX,
    screenY: options.screenY ?? clientY,
    radiusX: 1,
    radiusY: 1,
    rotationAngle: 0,
    force: 1,
  } as Touch
}

function dispatchTouchEvent(
  type: 'touchstart' | 'touchmove' | 'touchend',
  touches: Touch[],
  changedTouches: Touch[] = touches,
) {
  const event = new Event(type) as TouchEvent

  Object.defineProperty(event, 'touches', {
    configurable: true,
    value: touches,
  })
  Object.defineProperty(event, 'changedTouches', {
    configurable: true,
    value: changedTouches,
  })

  window.dispatchEvent(event)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useMouse', () => {
  it('should return default state', () => {
    const { result } = renderHook(() => useMouse())

    expect(result.current).toEqual({
      x: 0,
      y: 0,
      sourceType: null,
    })
  })

  it('should update position from mousemove', () => {
    const { result } = renderHook(() => useMouse({ type: 'client' }))

    act(() => {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 24, clientY: 12 }),
      )
    })

    expect(result.current).toEqual({
      x: 24,
      y: 12,
      sourceType: 'mouse',
    })
  })

  it('should update position from movement coordinates', () => {
    const { result } = renderHook(() => useMouse({ type: 'movement' }))

    act(() => {
      const event = new MouseEvent('mousemove')
      Object.defineProperty(event, 'movementX', {
        configurable: true,
        value: 7,
      })
      Object.defineProperty(event, 'movementY', {
        configurable: true,
        value: -4,
      })
      window.dispatchEvent(event)
    })

    expect(result.current).toEqual({
      x: 7,
      y: -4,
      sourceType: 'mouse',
    })
  })

  it('should update position from touch events', () => {
    const { result } = renderHook(() => useMouse())

    act(() => {
      dispatchTouchEvent('touchmove', [
        createTouchPoint({ pageX: 88, pageY: 99 }),
      ])
    })

    expect(result.current).toEqual({
      x: 88,
      y: 99,
      sourceType: 'touch',
    })
  })

  it('should not update from touch events when touch is disabled', () => {
    const { result } = renderHook(() => useMouse({ touch: false }))

    act(() => {
      dispatchTouchEvent('touchmove', [
        createTouchPoint({ pageX: 88, pageY: 99 }),
      ])
    })

    expect(result.current).toEqual({
      x: 0,
      y: 0,
      sourceType: null,
    })
  })

  it('should reset coordinates on touchend when resetOnTouchEnds is true', () => {
    const { result } = renderHook(() =>
      useMouse({
        resetOnTouchEnds: true,
        initialValue: { x: 5, y: 6 },
      }),
    )

    act(() => {
      dispatchTouchEvent('touchstart', [
        createTouchPoint({ pageX: 33, pageY: 44 }),
      ])
    })

    expect(result.current).toEqual({
      x: 33,
      y: 44,
      sourceType: 'touch',
    })

    act(() => {
      dispatchTouchEvent(
        'touchend',
        [],
        [createTouchPoint({ pageX: 100, pageY: 120 })],
      )
    })

    expect(result.current).toEqual({
      x: 5,
      y: 6,
      sourceType: 'touch',
    })
  })

  it('should attach and detach mouse listeners', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useMouse({ touch: false }))

    const addedEventNames = addEventListenerSpy.mock.calls.map(
      (call) => call[0],
    )
    expect(addedEventNames).toContain('mousemove')
    expect(addedEventNames).toContain('dragover')
    expect(addedEventNames).not.toContain('touchstart')
    expect(addedEventNames).not.toContain('touchmove')
    expect(addedEventNames).not.toContain('touchend')

    unmount()

    const removedEventNames = removeEventListenerSpy.mock.calls.map(
      (call) => call[0],
    )
    expect(removedEventNames).toContain('mousemove')
    expect(removedEventNames).toContain('dragover')
    expect(removedEventNames).not.toContain('touchstart')
    expect(removedEventNames).not.toContain('touchmove')
    expect(removedEventNames).not.toContain('touchend')
  })
})
