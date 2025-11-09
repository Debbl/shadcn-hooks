import { act, renderHook } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHover } from './index'

describe('useHover', () => {
  let element: HTMLDivElement

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.removeChild(element)
    vi.restoreAllMocks()
  })

  it('should return false by default', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { result } = renderHook(() => useHover(elementRef))

    expect(result.current).toBe(false)
  })

  it('should return true when mouse enters', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { result } = renderHook(() => useHover(elementRef))

    expect(result.current).toBe(false)

    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
      element.dispatchEvent(mouseEnterEvent)
    })

    expect(result.current).toBe(true)
  })

  it('should return false when mouse leaves', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { result } = renderHook(() => useHover(elementRef))

    // Enter
    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
      element.dispatchEvent(mouseEnterEvent)
    })
    expect(result.current).toBe(true)

    // Leave
    act(() => {
      const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true })
      element.dispatchEvent(mouseLeaveEvent)
    })
    expect(result.current).toBe(false)
  })

  it('should call onEnter callback when mouse enters', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element
    const onEnter = vi.fn()

    renderHook(() => useHover(elementRef, { onEnter }))

    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
      element.dispatchEvent(mouseEnterEvent)
    })

    expect(onEnter).toHaveBeenCalledTimes(1)
  })

  it('should call onLeave callback when mouse leaves', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element
    const onLeave = vi.fn()

    renderHook(() => useHover(elementRef, { onLeave }))

    // Enter first
    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
      element.dispatchEvent(mouseEnterEvent)
    })

    // Then leave
    act(() => {
      const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true })
      element.dispatchEvent(mouseLeaveEvent)
    })

    expect(onLeave).toHaveBeenCalledTimes(1)
  })

  it('should call onChange callback with correct value', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element
    const onChange = vi.fn()

    renderHook(() => useHover(elementRef, { onChange }))

    // Enter
    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
      element.dispatchEvent(mouseEnterEvent)
    })
    expect(onChange).toHaveBeenCalledWith(true)
    expect(onChange).toHaveBeenCalledTimes(1)

    // Leave
    act(() => {
      const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true })
      element.dispatchEvent(mouseLeaveEvent)
    })
    expect(onChange).toHaveBeenCalledWith(false)
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('should work with all callbacks together', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element
    const onEnter = vi.fn()
    const onLeave = vi.fn()
    const onChange = vi.fn()

    renderHook(() => useHover(elementRef, { onEnter, onLeave, onChange }))

    // Enter
    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
      element.dispatchEvent(mouseEnterEvent)
    })
    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(true)
    expect(onLeave).not.toHaveBeenCalled()

    // Leave
    act(() => {
      const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true })
      element.dispatchEvent(mouseLeaveEvent)
    })
    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(false)
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('should work with element directly', () => {
    const { result } = renderHook(() => useHover(element))

    expect(result.current).toBe(false)

    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
      element.dispatchEvent(mouseEnterEvent)
    })
    expect(result.current).toBe(true)

    act(() => {
      const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true })
      element.dispatchEvent(mouseLeaveEvent)
    })
    expect(result.current).toBe(false)
  })

  it('should work with function that returns element', () => {
    const { result } = renderHook(() => useHover(() => element))

    expect(result.current).toBe(false)

    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
      element.dispatchEvent(mouseEnterEvent)
    })
    expect(result.current).toBe(true)

    act(() => {
      const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true })
      element.dispatchEvent(mouseLeaveEvent)
    })
    expect(result.current).toBe(false)
  })
})
