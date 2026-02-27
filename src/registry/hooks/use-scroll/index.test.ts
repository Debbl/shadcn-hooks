import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useScroll } from './index'

interface ScrollPosition {
  left: number
  top: number
}

const scrollPositions = new WeakMap<HTMLElement, ScrollPosition>()

function getScrollPosition(el: HTMLElement): ScrollPosition {
  return scrollPositions.get(el) ?? { left: 0, top: 0 }
}

function setScrollPosition(el: HTMLElement, left: number, top: number) {
  scrollPositions.set(el, { left, top })
}

function setupScrollableElement(
  scrollWidth = 1000,
  scrollHeight = 2000,
  clientWidth = 200,
  clientHeight = 400,
) {
  const el = document.createElement('div')

  Object.defineProperties(el, {
    scrollLeft: {
      configurable: true,
      get: vi.fn(() => getScrollPosition(el).left),
    },
    scrollTop: {
      configurable: true,
      get: vi.fn(() => getScrollPosition(el).top),
    },
    scrollWidth: { configurable: true, value: scrollWidth },
    scrollHeight: { configurable: true, value: scrollHeight },
    clientWidth: { configurable: true, value: clientWidth },
    clientHeight: { configurable: true, value: clientHeight },
  })

  setScrollPosition(el, 0, 0)

  document.body.appendChild(el)
  return el
}

function scrollElement(el: HTMLElement, scrollLeft: number, scrollTop: number) {
  setScrollPosition(el, scrollLeft, scrollTop)
  el.dispatchEvent(new Event('scroll'))
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('useScroll', () => {
  it('should return default state', () => {
    const el = setupScrollableElement()
    const { result } = renderHook(() => useScroll(el))

    expect(result.current.x).toBe(0)
    expect(result.current.y).toBe(0)
    expect(result.current.isScrolling).toBe(false)
    expect(result.current.directions).toEqual({
      left: false,
      right: false,
      up: false,
      down: false,
    })
    expect(result.current.arrivedState.top).toBe(true)
    expect(result.current.arrivedState.left).toBe(true)
  })

  it('should update x and y on scroll', () => {
    const el = setupScrollableElement()
    const { result } = renderHook(() => useScroll(el))

    act(() => {
      scrollElement(el, 100, 200)
    })

    expect(result.current.x).toBe(100)
    expect(result.current.y).toBe(200)
  })

  it('should track scroll direction', () => {
    const el = setupScrollableElement()
    const { result } = renderHook(() => useScroll(el))

    act(() => {
      scrollElement(el, 50, 80)
    })

    expect(result.current.directions.right).toBe(true)
    expect(result.current.directions.down).toBe(true)
    expect(result.current.directions.left).toBe(false)
    expect(result.current.directions.up).toBe(false)
  })

  it('should track reverse scroll direction', () => {
    const el = setupScrollableElement()
    const { result } = renderHook(() => useScroll(el))

    act(() => {
      scrollElement(el, 100, 100)
    })
    act(() => {
      scrollElement(el, 50, 30)
    })

    expect(result.current.directions.left).toBe(true)
    expect(result.current.directions.up).toBe(true)
    expect(result.current.directions.right).toBe(false)
    expect(result.current.directions.down).toBe(false)
  })

  it('should detect arrival at bottom boundary', () => {
    // scrollHeight=2000, clientHeight=400 → bottom when scrollTop >= 1600
    const el = setupScrollableElement(1000, 2000, 200, 400)
    const { result } = renderHook(() => useScroll(el))

    expect(result.current.arrivedState.bottom).toBe(false)

    act(() => {
      scrollElement(el, 0, 1600)
    })

    expect(result.current.arrivedState.bottom).toBe(true)
  })

  it('should detect arrival at right boundary', () => {
    // scrollWidth=1000, clientWidth=200 → right when scrollLeft >= 800
    const el = setupScrollableElement(1000, 2000, 200, 400)
    const { result } = renderHook(() => useScroll(el))

    expect(result.current.arrivedState.right).toBe(false)

    act(() => {
      scrollElement(el, 800, 0)
    })

    expect(result.current.arrivedState.right).toBe(true)
  })

  it('should set isScrolling to true during scroll and false after idle', () => {
    vi.useFakeTimers()
    const el = setupScrollableElement()
    const { result } = renderHook(() => useScroll(el, { idle: 200 }))

    act(() => {
      scrollElement(el, 0, 50)
    })

    expect(result.current.isScrolling).toBe(true)

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.isScrolling).toBe(false)
  })

  it('should reset directions to false after idle', () => {
    vi.useFakeTimers()
    const el = setupScrollableElement()
    const { result } = renderHook(() => useScroll(el, { idle: 200 }))

    act(() => {
      scrollElement(el, 0, 50)
    })

    expect(result.current.directions.down).toBe(true)

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.directions).toEqual({
      left: false,
      right: false,
      up: false,
      down: false,
    })
  })

  it('should call onScroll callback', () => {
    const onScroll = vi.fn()
    const el = setupScrollableElement()
    renderHook(() => useScroll(el, { onScroll }))

    act(() => {
      scrollElement(el, 0, 50)
    })

    expect(onScroll).toHaveBeenCalledTimes(1)
  })

  it('should call onStop callback after idle', () => {
    vi.useFakeTimers()
    const onStop = vi.fn()
    const el = setupScrollableElement()
    renderHook(() => useScroll(el, { idle: 150, onStop }))

    act(() => {
      scrollElement(el, 0, 50)
    })

    expect(onStop).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(onStop).toHaveBeenCalledTimes(1)
  })

  it('should respect offset for boundary detection', () => {
    // scrollHeight=2000, clientHeight=400 → bottom at scrollTop+clientHeight >= scrollHeight-offset
    // With offset.bottom=50: bottom when scrollTop+400 >= 2000-50 → scrollTop >= 1550
    const el = setupScrollableElement(1000, 2000, 200, 400)
    const { result } = renderHook(() =>
      useScroll(el, { offset: { bottom: 50 } }),
    )

    act(() => {
      scrollElement(el, 0, 1550)
    })

    expect(result.current.arrivedState.bottom).toBe(true)
  })

  it('should update state via measure()', () => {
    const el = setupScrollableElement()
    const { result } = renderHook(() => useScroll(el))

    // Manually update scroll position without dispatching event
    setScrollPosition(el, 0, 300)

    act(() => {
      result.current.measure()
    })

    expect(result.current.y).toBe(300)
  })
})
