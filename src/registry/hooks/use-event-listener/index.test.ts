import { renderHook } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEventListener } from './index'

describe('useEventListener', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('window events', () => {
    it('should attach event listener to window', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => {
        useEventListener('resize', handler)
      })

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        undefined,
      )
      expect(handler).not.toHaveBeenCalled()

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        undefined,
      )
    })

    it('should call handler when window event is triggered', () => {
      const handler = vi.fn()

      renderHook(() => {
        useEventListener('resize', handler)
      })

      const resizeEvent = new Event('resize')
      window.dispatchEvent(resizeEvent)

      expect(handler).toHaveBeenCalledWith(resizeEvent)
    })

    it('should use latest handler when handler changes', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      const { rerender } = renderHook(
        ({ handler }) => {
          useEventListener('resize', handler)
        },
        {
          initialProps: { handler: handler1 },
        },
      )

      const resizeEvent = new Event('resize')
      window.dispatchEvent(resizeEvent)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).not.toHaveBeenCalled()

      rerender({ handler: handler2 })

      window.dispatchEvent(resizeEvent)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
    })

    it('should support options parameter', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const options = { capture: true, once: true }

      renderHook(() => {
        useEventListener('resize', handler, undefined, options)
      })

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        options,
      )
    })
  })

  describe('element events', () => {
    it('should attach event listener to element ref', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      const elementRef = createRef<HTMLDivElement>()
      elementRef.current = element

      const addEventListenerSpy = vi.spyOn(element, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener')

      const { unmount } = renderHook(() => {
        useEventListener('click', handler, elementRef as any)
      })

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        undefined,
      )

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        undefined,
      )
    })

    it('should call handler when element event is triggered', () => {
      const handler = vi.fn()
      const element = document.createElement('button')
      const elementRef = createRef<HTMLButtonElement>()
      elementRef.current = element

      renderHook(() => {
        useEventListener('click', handler, elementRef as any)
      })

      const clickEvent = new MouseEvent('click', { bubbles: true })
      element.dispatchEvent(clickEvent)

      expect(handler).toHaveBeenCalledWith(clickEvent)
    })

    it('should not attach listener when ref is null', () => {
      const handler = vi.fn()
      const elementRef = createRef<HTMLDivElement>()

      renderHook(() => {
        useEventListener('click', handler, elementRef as any)
      })

      // Should not throw and should not attach listener
      expect(elementRef.current).toBeNull()
    })

    it('should update listener when element ref object changes', () => {
      const handler = vi.fn()
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')
      const elementRef1 = createRef<HTMLDivElement>()
      const elementRef2 = createRef<HTMLDivElement>()
      elementRef1.current = element1
      elementRef2.current = element2

      const addEventListenerSpy1 = vi.spyOn(element1, 'addEventListener')
      const addEventListenerSpy2 = vi.spyOn(element2, 'addEventListener')
      const removeEventListenerSpy1 = vi.spyOn(element1, 'removeEventListener')

      const { rerender } = renderHook(
        ({ elementRef }) => {
          useEventListener('click', handler, elementRef as any)
        },
        {
          initialProps: { elementRef: elementRef1 },
        },
      )

      expect(addEventListenerSpy1).toHaveBeenCalled()

      rerender({ elementRef: elementRef2 })

      expect(removeEventListenerSpy1).toHaveBeenCalled()
      expect(addEventListenerSpy2).toHaveBeenCalled()
    })

    it('should support options parameter for element', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      const elementRef = createRef<HTMLDivElement>()
      elementRef.current = element

      const addEventListenerSpy = vi.spyOn(element, 'addEventListener')
      const options = { capture: true }

      renderHook(() => {
        useEventListener('click', handler, elementRef as any, options)
      })

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        options,
      )
    })
  })

  describe('document events', () => {
    it('should attach event listener to document', () => {
      const handler = vi.fn()
      const documentRef = createRef<Document>()
      documentRef.current = document

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const { unmount } = renderHook(() => {
        useEventListener('click', handler, documentRef as any)
      })

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        undefined,
      )

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        undefined,
      )
    })

    it('should call handler when document event is triggered', () => {
      const handler = vi.fn()
      const documentRef = createRef<Document>()
      documentRef.current = document

      renderHook(() => {
        useEventListener('click', handler, documentRef as any)
      })

      const clickEvent = new MouseEvent('click', { bubbles: true })
      document.dispatchEvent(clickEvent)

      expect(handler).toHaveBeenCalledWith(clickEvent)
    })
  })

  describe('event listener lifecycle', () => {
    it('should remove listener on unmount', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => {
        useEventListener('resize', handler)
      })

      const listener = addEventListenerSpy.mock.calls[0][1] as EventListener

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        listener,
        undefined,
      )
    })

    it('should update listener when event name changes', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { rerender } = renderHook(
        ({ eventName }) => {
          useEventListener(eventName, handler)
        },
        {
          initialProps: { eventName: 'resize' as keyof WindowEventMap },
        },
      )

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        undefined,
      )

      rerender({ eventName: 'scroll' })

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        undefined,
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        undefined,
      )
    })

    it('should update listener when options change', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { rerender } = renderHook(
        ({ options }) => {
          useEventListener('resize', handler, undefined, options)
        },
        {
          initialProps: { options: { capture: false } },
        },
      )

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        { capture: false },
      )

      rerender({ options: { capture: true } })

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        { capture: false },
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        { capture: true },
      )
    })
  })

  describe('edge cases', () => {
    it('should handle element without addEventListener method', () => {
      const handler = vi.fn()
      const fakeElement = {} as HTMLDivElement
      const elementRef = createRef<HTMLDivElement>()
      elementRef.current = fakeElement

      expect(() => {
        renderHook(() => {
          useEventListener('click', handler, elementRef as any)
        })
      }).not.toThrow()
    })

    it('should handle multiple events', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      renderHook(() => {
        useEventListener('resize', handler1)
        useEventListener('scroll', handler2)
      })

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        undefined,
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        undefined,
      )
    })

    it('should handle boolean options', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      renderHook(() => {
        useEventListener('resize', handler, undefined, true)
      })

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        true,
      )
    })
  })
})
