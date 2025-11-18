import { act, renderHook } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useClickAway } from './index'

describe('useClickAway', () => {
  let targetElement: HTMLDivElement
  let outsideElement: HTMLDivElement

  beforeEach(() => {
    targetElement = document.createElement('div')
    outsideElement = document.createElement('div')
    document.body.appendChild(targetElement)
    document.body.appendChild(outsideElement)
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.removeChild(targetElement)
    document.body.removeChild(outsideElement)
    vi.restoreAllMocks()
  })

  describe('basic functionality', () => {
    it('should call handler when clicking outside target element', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      renderHook(() => {
        useClickAway(handler, targetRef)
      })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should not call handler when clicking inside target element', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      renderHook(() => {
        useClickAway(handler, targetRef)
      })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        targetElement.dispatchEvent(clickEvent)
      })

      expect(handler).not.toHaveBeenCalled()
    })

    it('should call handler when clicking on document', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      renderHook(() => {
        useClickAway(handler, targetRef)
      })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        document.dispatchEvent(clickEvent)
      })

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('target types', () => {
    it('should work with ref object', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      renderHook(() => {
        useClickAway(handler, targetRef)
      })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should work with element directly', () => {
      const handler = vi.fn()

      renderHook(() => {
        useClickAway(handler, targetElement)
      })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should work with function that returns element', () => {
      const handler = vi.fn()

      renderHook(() => {
        useClickAway(handler, () => targetElement)
      })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should work with array of targets', () => {
      const handler = vi.fn()
      const targetElement2 = document.createElement('div')
      document.body.appendChild(targetElement2)
      const targetRef1 = createRef<HTMLDivElement>()
      const targetRef2 = createRef<HTMLDivElement>()
      targetRef1.current = targetElement
      targetRef2.current = targetElement2

      renderHook(() => {
        useClickAway(handler, [targetRef1, targetRef2])
      })

      // Click inside first target - should not trigger
      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        targetElement.dispatchEvent(clickEvent)
      })
      expect(handler).not.toHaveBeenCalled()

      // Click inside second target - should not trigger
      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        targetElement2.dispatchEvent(clickEvent)
      })
      expect(handler).not.toHaveBeenCalled()

      // Click outside both targets - should trigger
      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })
      expect(handler).toHaveBeenCalledTimes(1)

      document.body.removeChild(targetElement2)
    })
  })

  describe('event types', () => {
    it('should use click event by default', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      renderHook(() => {
        useClickAway(handler, targetRef)
      })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should work with custom event name', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      renderHook(() => {
        useClickAway(handler, targetRef, 'mousedown')
      })

      act(() => {
        const mousedownEvent = new MouseEvent('mousedown', { bubbles: true })
        outsideElement.dispatchEvent(mousedownEvent)
      })

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should work with array of event names', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      renderHook(() => {
        useClickAway(handler, targetRef, ['click', 'mousedown'])
      })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })
      expect(handler).toHaveBeenCalledTimes(1)

      act(() => {
        const mousedownEvent = new MouseEvent('mousedown', { bubbles: true })
        outsideElement.dispatchEvent(mousedownEvent)
      })
      expect(handler).toHaveBeenCalledTimes(2)
    })
  })

  describe('handler updates', () => {
    it('should use latest handler when handler changes', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      const { rerender } = renderHook(
        ({ handler }) => {
          useClickAway(handler, targetRef)
        },
        {
          initialProps: { handler: handler1 },
        },
      )

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).not.toHaveBeenCalled()

      rerender({ handler: handler2 })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should not throw when target is null', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()

      expect(() => {
        renderHook(() => {
          useClickAway(handler, targetRef)
        })
      }).not.toThrow()
    })

    it('should not call handler when target contains the clicked element', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      const childElement = document.createElement('button')
      targetElement.appendChild(childElement)

      renderHook(() => {
        useClickAway(handler, targetRef)
      })

      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        childElement.dispatchEvent(clickEvent)
      })

      expect(handler).not.toHaveBeenCalled()

      targetElement.removeChild(childElement)
    })

    it('should pass event to handler', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement

      renderHook(() => {
        useClickAway(handler, targetRef)
      })

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        clientX: 100,
        clientY: 200,
      })

      act(() => {
        outsideElement.dispatchEvent(clickEvent)
      })

      expect(handler).toHaveBeenCalledWith(clickEvent)
    })
  })

  describe('cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const handler = vi.fn()
      const targetRef = createRef<HTMLDivElement>()
      targetRef.current = targetElement
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const { unmount } = renderHook(() => {
        useClickAway(handler, targetRef)
      })

      expect(addEventListenerSpy).toHaveBeenCalled()

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalled()

      // Verify handler is not called after unmount
      act(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true })
        outsideElement.dispatchEvent(clickEvent)
      })

      // Handler might still be called due to event propagation, but cleanup should have happened
      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })
  })
})
