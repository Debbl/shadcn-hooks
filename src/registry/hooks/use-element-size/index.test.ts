import { act, renderHook, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useElementSize } from './index'

interface Size {
  width: number
  height: number
}

interface ResizeEntryConfig {
  contentRect: Size
  contentBox?: Size
  borderBox?: Size
  devicePixelContentBox?: Size
}

class MockResizeObserver {
  public observe =
    vi.fn<(target: Element, options?: ResizeObserverOptions) => void>()
  public disconnect = vi.fn<() => void>()
  public unobserve = vi.fn<(target: Element) => void>()

  public constructor(public callback: ResizeObserverCallback) {}
}

function createRect(width: number, height: number): DOMRectReadOnly {
  return {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON: () => ({}),
  } as DOMRectReadOnly
}

function createObserverSize(size: Size): ResizeObserverSize {
  return {
    inlineSize: size.width,
    blockSize: size.height,
  } as ResizeObserverSize
}

function createResizeEntry(
  target: Element,
  config: ResizeEntryConfig,
): ResizeObserverEntry {
  return {
    target,
    contentRect: createRect(
      config.contentRect.width,
      config.contentRect.height,
    ),
    contentBoxSize: config.contentBox
      ? [createObserverSize(config.contentBox)]
      : undefined,
    borderBoxSize: config.borderBox
      ? [createObserverSize(config.borderBox)]
      : undefined,
    devicePixelContentBoxSize: config.devicePixelContentBox
      ? [createObserverSize(config.devicePixelContentBox)]
      : undefined,
  } as ResizeObserverEntry
}

describe('useElementSize', () => {
  let element: HTMLDivElement
  let mockObserver: MockResizeObserver | undefined
  let originalResizeObserver: typeof ResizeObserver | undefined

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
    mockObserver = undefined

    originalResizeObserver = globalThis.ResizeObserver
    const ResizeObserverClass = class extends MockResizeObserver {
      public constructor(callback: ResizeObserverCallback) {
        super(callback)
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        mockObserver = this
      }
    }

    globalThis.ResizeObserver =
      ResizeObserverClass as unknown as typeof ResizeObserver
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.removeChild(element)

    if (originalResizeObserver) {
      globalThis.ResizeObserver = originalResizeObserver
    } else {
      Reflect.deleteProperty(globalThis, 'ResizeObserver')
    }

    vi.restoreAllMocks()
  })

  function triggerResize(entry: ResizeObserverEntry) {
    if (!mockObserver) {
      throw new Error('mockObserver is not initialized')
    }

    act(() => {
      mockObserver!.callback(
        [entry],
        mockObserver! as unknown as ResizeObserver,
      )
    })
  }

  it('should return default size initially', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { result } = renderHook(() => useElementSize(elementRef))

    expect(result.current).toEqual({ width: 0, height: 0 })
  })

  it('should support custom initial size', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { result } = renderHook(() =>
      useElementSize(elementRef, { width: 12, height: 24 }),
    )

    expect(result.current).toEqual({ width: 12, height: 24 })
  })

  it('should observe the target element', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    renderHook(() => useElementSize(elementRef))

    expect(mockObserver?.observe).toHaveBeenCalledWith(element, {
      box: 'content-box',
    })
  })

  it('should update size from contentRect by default', async () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element
    const { result } = renderHook(() => useElementSize(elementRef))

    triggerResize(
      createResizeEntry(element, {
        contentRect: { width: 180, height: 90 },
      }),
    )

    await waitFor(() => {
      expect(result.current).toEqual({ width: 180, height: 90 })
    })
  })

  it('should use border-box size when box option is border-box', async () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element
    const { result } = renderHook(() =>
      useElementSize(
        elementRef,
        { width: 0, height: 0 },
        { box: 'border-box' },
      ),
    )

    triggerResize(
      createResizeEntry(element, {
        contentRect: { width: 150, height: 80 },
        borderBox: { width: 200, height: 100 },
      }),
    )

    await waitFor(() => {
      expect(result.current).toEqual({ width: 200, height: 100 })
    })
  })

  it('should use device-pixel-content-box when configured', async () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element
    const { result } = renderHook(() =>
      useElementSize(
        elementRef,
        { width: 0, height: 0 },
        { box: 'device-pixel-content-box' },
      ),
    )

    triggerResize(
      createResizeEntry(element, {
        contentRect: { width: 160, height: 80 },
        devicePixelContentBox: { width: 320, height: 160 },
      }),
    )

    await waitFor(() => {
      expect(result.current).toEqual({ width: 320, height: 160 })
    })
  })

  it('should use getBoundingClientRect for SVG elements', async () => {
    const svgElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    )
    document.body.appendChild(svgElement)

    const elementRef = createRef<SVGSVGElement>()
    elementRef.current = svgElement

    const getBoundingClientRectSpy = vi
      .spyOn(svgElement, 'getBoundingClientRect')
      .mockReturnValue(createRect(240, 120) as DOMRect)

    const { result } = renderHook(() => useElementSize(elementRef))

    triggerResize(
      createResizeEntry(svgElement, {
        contentRect: { width: 10, height: 10 },
        contentBox: { width: 10, height: 10 },
      }),
    )

    await waitFor(() => {
      expect(result.current).toEqual({ width: 240, height: 120 })
    })

    expect(getBoundingClientRectSpy).toHaveBeenCalled()

    document.body.removeChild(svgElement)
  })

  it('should reset size to zero when target is missing', async () => {
    const elementRef = createRef<HTMLDivElement>()

    const { result } = renderHook(() =>
      useElementSize(elementRef, { width: 64, height: 32 }),
    )

    await waitFor(() => {
      expect(result.current).toEqual({ width: 0, height: 0 })
    })
  })

  it('should disconnect observer on unmount', () => {
    const elementRef = createRef<HTMLDivElement>()
    elementRef.current = element

    const { unmount } = renderHook(() => useElementSize(elementRef))

    unmount()

    expect(mockObserver?.disconnect).toHaveBeenCalledTimes(1)
  })
})
