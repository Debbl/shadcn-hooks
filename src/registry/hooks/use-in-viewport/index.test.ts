import { act, renderHook, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInViewport } from './index'

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {}
}

describe('useInViewport', () => {
  let element: HTMLDivElement
  let mockObserver: MockIntersectionObserver | undefined
  let originalIntersectionObserver: typeof IntersectionObserver

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
    mockObserver = undefined

    // Mock IntersectionObserver
    originalIntersectionObserver = globalThis.IntersectionObserver
    const MockObserverClass = class extends MockIntersectionObserver {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        super(callback, options)
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        mockObserver = this
      }
    }
    globalThis.IntersectionObserver = MockObserverClass as any

    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.removeChild(element)
    globalThis.IntersectionObserver = originalIntersectionObserver
    vi.restoreAllMocks()
  })

  const triggerIntersection = (
    isIntersecting: boolean,
    intersectionRatio: number = isIntersecting ? 1 : 0,
  ) => {
    if (!mockObserver) {
      throw new Error('mockObserver is not initialized')
    }

    act(() => {
      const entry = {
        target: element,
        isIntersecting,
        intersectionRatio,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry

      mockObserver!.callback(
        [entry],
        mockObserver! as unknown as IntersectionObserver,
      )
    })
  }

  it('should return undefined initially', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { result } = renderHook(() => useInViewport(elementRef))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
  })

  it('should observe the target element', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    renderHook(() => useInViewport(elementRef))

    expect(mockObserver?.observe).toHaveBeenCalledWith(element)
  })

  it('should update state when element enters viewport', async () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { result } = renderHook(() => useInViewport(elementRef))

    triggerIntersection(true, 1)

    await waitFor(() => {
      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toBe(1)
    })
  })

  it('should update state when element leaves viewport', async () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { result } = renderHook(() => useInViewport(elementRef))

    // Enter viewport
    triggerIntersection(true, 1)
    await waitFor(() => {
      expect(result.current[0]).toBe(true)
    })

    // Leave viewport
    triggerIntersection(false, 0)
    await waitFor(() => {
      expect(result.current[0]).toBe(false)
      expect(result.current[1]).toBe(0)
    })
  })

  it('should update ratio correctly', async () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { result } = renderHook(() => useInViewport(elementRef))

    triggerIntersection(true, 0.5)

    await waitFor(() => {
      expect(result.current[0]).toBe(true)
      expect(result.current[1]).toBe(0.5)
    })
  })

  it('should call callback when provided', async () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element
    const callback = vi.fn()

    renderHook(() => useInViewport(elementRef, { callback }))

    if (!mockObserver) {
      throw new Error('mockObserver is not initialized')
    }

    const entry = {
      target: element,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry

    act(() => {
      mockObserver!.callback(
        [entry],
        mockObserver! as unknown as IntersectionObserver,
      )
    })

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(entry)
    })
  })

  it('should pass options to IntersectionObserver', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const options = {
      rootMargin: '10px',
      threshold: 0.5,
    }

    renderHook(() => useInViewport(elementRef, options))

    expect(mockObserver?.options).toMatchObject({
      rootMargin: '10px',
      threshold: 0.5,
    })
  })

  it('should support root element option', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element
    const rootElement = document.createElement('div')

    renderHook(() => useInViewport(elementRef, { root: rootElement }))

    expect(mockObserver?.options?.root).toBe(rootElement)
  })

  it('should support array of targets', () => {
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
    document.body.appendChild(element1)
    document.body.appendChild(element2)

    const elementRef1 = createRef<HTMLDivElement>()
    const elementRef2 = createRef<HTMLDivElement>()
    elementRef1.current = element1
    elementRef2.current = element2

    renderHook(() => useInViewport([elementRef1, elementRef2]))

    expect(mockObserver?.observe).toHaveBeenCalledWith(element1)
    expect(mockObserver?.observe).toHaveBeenCalledWith(element2)

    document.body.removeChild(element1)
    document.body.removeChild(element2)
  })

  it('should work with element directly', () => {
    renderHook(() => useInViewport(element))

    expect(mockObserver?.observe).toHaveBeenCalledWith(element)
  })

  it('should work with function that returns element', () => {
    renderHook(() => useInViewport(() => element))

    expect(mockObserver?.observe).toHaveBeenCalledWith(element)
  })

  it('should disconnect observer on unmount', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { unmount } = renderHook(() => useInViewport(elementRef))

    unmount()

    expect(mockObserver?.disconnect).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple intersection entries', async () => {
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
    document.body.appendChild(element1)
    document.body.appendChild(element2)

    const elementRef1 = createRef<HTMLDivElement>()
    const elementRef2 = createRef<HTMLDivElement>()
    elementRef1.current = element1
    elementRef2.current = element2

    const { result } = renderHook(() =>
      useInViewport([elementRef1, elementRef2]),
    )

    if (!mockObserver) {
      throw new Error('mockObserver is not initialized')
    }

    act(() => {
      const entry1 = {
        target: element1,
        isIntersecting: true,
        intersectionRatio: 0.8,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry

      const entry2 = {
        target: element2,
        isIntersecting: false,
        intersectionRatio: 0.2,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry

      mockObserver!.callback(
        [entry1, entry2],
        mockObserver! as unknown as IntersectionObserver,
      )
    })

    // Should use the last entry's values
    await waitFor(() => {
      expect(result.current[0]).toBe(false)
      expect(result.current[1]).toBe(0.2)
    })

    document.body.removeChild(element1)
    document.body.removeChild(element2)
  })

  it('should handle null/undefined target gracefully', () => {
    const elementRef = createRef<HTMLDivElement>()
    // elementRef.current is null
    mockObserver = undefined

    const { result } = renderHook(() => useInViewport(elementRef))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[1]).toBeUndefined()
    // When target is null, observer is not created because els.length is 0
    expect(mockObserver).toBeUndefined()
  })

  it('should re-observe when target changes', () => {
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
    document.body.appendChild(element1)
    document.body.appendChild(element2)

    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element1

    const { rerender } = renderHook(({ target }) => useInViewport(target), {
      initialProps: { target: elementRef },
    })

    const firstObserver = mockObserver
    expect(firstObserver?.observe).toHaveBeenCalledWith(element1)

    // Change target
    elementRef.current = element2
    rerender({ target: elementRef })

    // Should disconnect old observer and create new one
    expect(firstObserver?.disconnect).toHaveBeenCalled()

    document.body.removeChild(element1)
    document.body.removeChild(element2)
  })
})
