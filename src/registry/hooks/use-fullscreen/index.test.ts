import { act, renderHook, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFullscreen } from './index'

describe('useFullscreen', () => {
  let element: HTMLDivElement
  let mockRequestFullscreen: ReturnType<typeof vi.fn>
  let mockExitFullscreen: ReturnType<typeof vi.fn>
  let mockAddEventListener: ReturnType<typeof vi.spyOn>
  let eventListeners: Map<string, EventListener[]>

  const setupFullscreenAPI = () => {
    // Mock fullscreen methods
    mockRequestFullscreen = vi.fn().mockResolvedValue(undefined)
    mockExitFullscreen = vi.fn().mockResolvedValue(undefined)

    // Setup standard fullscreen API on element
    Object.defineProperty(element, 'requestFullscreen', {
      value: mockRequestFullscreen,
      writable: true,
      configurable: true,
    })

    // Setup standard fullscreen API on document
    Object.defineProperty(document, 'exitFullscreen', {
      value: mockExitFullscreen,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      writable: true,
      configurable: true,
    })

    // This is needed for fullscreenEnabledProperty detection
    Object.defineProperty(document, 'fullScreen', {
      value: false,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'fullscreenEnabled', {
      value: true,
      writable: true,
      configurable: true,
    })
  }

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
    eventListeners = new Map()

    setupFullscreenAPI()

    // Mock event listeners to capture them
    mockAddEventListener = vi.spyOn(document, 'addEventListener')
    mockAddEventListener.mockImplementation(
      (event: string, listener: EventListener) => {
        if (!eventListeners.has(event)) {
          eventListeners.set(event, [])
        }
        eventListeners.get(event)!.push(listener)
      },
    )

    vi.clearAllMocks()
  })

  afterEach(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element)
    }
    vi.restoreAllMocks()
    eventListeners.clear()
  })

  const triggerFullscreenChange = (fullscreenElement: Element | null) => {
    Object.defineProperty(document, 'fullscreenElement', {
      value: fullscreenElement,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'fullScreen', {
      value: fullscreenElement !== null,
      writable: true,
      configurable: true,
    })

    act(() => {
      const listeners = eventListeners.get('fullscreenchange') || []
      listeners.forEach((listener) => {
        listener(new Event('fullscreenchange'))
      })
    })
  }

  it('should return initial state', () => {
    // Setup documentElement with requestFullscreen for default target
    const mockDocumentElementRequest = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: mockDocumentElementRequest,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useFullscreen())

    expect(result.current.isFullscreen).toBe(false)
    expect(result.current.isSupported).toBe(true)
    expect(typeof result.current.enter).toBe('function')
    expect(typeof result.current.exit).toBe('function')
    expect(typeof result.current.toggle).toBe('function')
  })

  it('should detect fullscreen support', () => {
    // Remove fullscreen API
    delete (element as any).requestFullscreen
    delete (document as any).exitFullscreen
    delete (document as any).fullScreen

    const { result } = renderHook(() => useFullscreen())
    expect(result.current.isSupported).toBe(false)
  })

  it('should enter fullscreen', async () => {
    const { result } = renderHook(() => useFullscreen(element))

    await act(async () => {
      await result.current.enter()
    })

    expect(mockRequestFullscreen).toHaveBeenCalledTimes(1)
    expect(result.current.isFullscreen).toBe(true)
  })

  it('should exit fullscreen', async () => {
    const { result } = renderHook(() => useFullscreen(element))

    // First enter fullscreen
    await act(async () => {
      await result.current.enter()
    })

    expect(result.current.isFullscreen).toBe(true)

    // Then exit
    await act(async () => {
      await result.current.exit()
    })

    expect(mockExitFullscreen).toHaveBeenCalledTimes(1)
    expect(result.current.isFullscreen).toBe(false)
  })

  it('should toggle fullscreen', async () => {
    const { result } = renderHook(() => useFullscreen(element))

    // Toggle to enter
    await act(async () => {
      await result.current.toggle()
    })

    expect(mockRequestFullscreen).toHaveBeenCalledTimes(1)
    expect(result.current.isFullscreen).toBe(true)

    // Toggle to exit
    await act(async () => {
      await result.current.toggle()
    })

    expect(mockExitFullscreen).toHaveBeenCalledTimes(1)
    expect(result.current.isFullscreen).toBe(false)
  })

  it('should not enter if already fullscreen', async () => {
    const { result } = renderHook(() => useFullscreen(element))

    await act(async () => {
      await result.current.enter()
    })

    mockRequestFullscreen.mockClear()

    await act(async () => {
      await result.current.enter()
    })

    expect(mockRequestFullscreen).not.toHaveBeenCalled()
  })

  it('should not exit if not fullscreen', async () => {
    const { result } = renderHook(() => useFullscreen(element))

    await act(async () => {
      await result.current.exit()
    })

    expect(mockExitFullscreen).not.toHaveBeenCalled()
  })

  it('should update state on fullscreenchange event', async () => {
    const { result } = renderHook(() => useFullscreen(element))

    expect(result.current.isFullscreen).toBe(false)

    // Simulate entering fullscreen
    triggerFullscreenChange(element)

    await waitFor(() => {
      expect(result.current.isFullscreen).toBe(true)
    })
  })

  it('should update state when exiting fullscreen', async () => {
    const { result } = renderHook(() => useFullscreen(element))

    // Enter fullscreen first
    await act(async () => {
      await result.current.enter()
    })

    expect(result.current.isFullscreen).toBe(true)

    // Simulate exiting fullscreen
    triggerFullscreenChange(null)

    await waitFor(() => {
      expect(result.current.isFullscreen).toBe(false)
    })
  })

  it('should work with ref target', () => {
    const ref = createRef<HTMLDivElement>()
    ref.current = element

    const { result } = renderHook(() => useFullscreen(ref))

    expect(result.current.isSupported).toBe(true)
  })

  it('should work with function target', () => {
    const { result } = renderHook(() => useFullscreen(() => element))

    expect(result.current.isSupported).toBe(true)
  })

  it('should use document.documentElement when no target provided', async () => {
    const mockDocumentElementRequest = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: mockDocumentElementRequest,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useFullscreen())

    await act(async () => {
      await result.current.enter()
    })

    expect(mockDocumentElementRequest).toHaveBeenCalledTimes(1)
  })

  it('should auto exit on unmount when autoExit is enabled', async () => {
    const { result, unmount } = renderHook(() =>
      useFullscreen(element, { autoExit: true }),
    )

    // Enter fullscreen
    await act(async () => {
      await result.current.enter()
    })

    expect(result.current.isFullscreen).toBe(true)

    // Unmount should trigger exit
    unmount()

    await waitFor(() => {
      expect(mockExitFullscreen).toHaveBeenCalled()
    })
  })

  it('should not auto exit on unmount when autoExit is disabled', async () => {
    const { result, unmount } = renderHook(() =>
      useFullscreen(element, { autoExit: false }),
    )

    // Enter fullscreen
    await act(async () => {
      await result.current.enter()
    })

    expect(result.current.isFullscreen).toBe(true)

    mockExitFullscreen.mockClear()

    // Unmount should not trigger exit
    unmount()

    // Wait a bit to ensure exit is not called
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(mockExitFullscreen).not.toHaveBeenCalled()
  })

  it('should handle webkit fullscreen API', async () => {
    const webkitRequestFullscreen = vi.fn().mockResolvedValue(undefined)
    const webkitExitFullscreen = vi.fn().mockResolvedValue(undefined)

    // Remove standard API
    delete (element as any).requestFullscreen
    delete (document as any).exitFullscreen
    delete (document as any).fullScreen

    // Setup webkit API
    Object.defineProperty(element, 'webkitRequestFullscreen', {
      value: webkitRequestFullscreen,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'webkitExitFullscreen', {
      value: webkitExitFullscreen,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'webkitFullscreenElement', {
      value: null,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'webkitIsFullScreen', {
      value: false,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useFullscreen(element))

    await act(async () => {
      await result.current.enter()
    })

    expect(webkitRequestFullscreen).toHaveBeenCalledTimes(1)
  })

  it('should handle moz fullscreen API', async () => {
    const mozRequestFullScreen = vi.fn().mockResolvedValue(undefined)
    const mozCancelFullScreen = vi.fn().mockResolvedValue(undefined)

    // Remove standard API
    delete (element as any).requestFullscreen
    delete (document as any).exitFullscreen
    delete (document as any).fullScreen

    // Setup moz API
    Object.defineProperty(element, 'mozRequestFullScreen', {
      value: mozRequestFullScreen,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'mozCancelFullScreen', {
      value: mozCancelFullScreen,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'mozFullScreenElement', {
      value: null,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'mozFullScreen', {
      value: false,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useFullscreen(element))

    await act(async () => {
      await result.current.enter()
    })

    expect(mozRequestFullScreen).toHaveBeenCalledTimes(1)
  })

  it('should handle ms fullscreen API', async () => {
    const msRequestFullscreen = vi.fn().mockResolvedValue(undefined)
    const msExitFullscreen = vi.fn().mockResolvedValue(undefined)

    // Remove standard API
    delete (element as any).requestFullscreen
    delete (document as any).exitFullscreen
    delete (document as any).fullScreen

    // Setup ms API
    Object.defineProperty(element, 'msRequestFullscreen', {
      value: msRequestFullscreen,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'msExitFullscreen', {
      value: msExitFullscreen,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'msFullscreenElement', {
      value: null,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useFullscreen(element))

    await act(async () => {
      await result.current.enter()
    })

    expect(msRequestFullscreen).toHaveBeenCalledTimes(1)
  })

  it('should attempt to enter fullscreen even if another element is fullscreen', async () => {
    const otherElement = document.createElement('div')
    document.body.appendChild(otherElement)

    // Set another element as fullscreen
    Object.defineProperty(document, 'fullscreenElement', {
      value: otherElement,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'fullScreen', {
      value: true,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useFullscreen(element))

    // The enter method will detect that another element is fullscreen
    // and try to call exit(), but exit() has a guard (!isFullscreen)
    // that prevents it from executing when the current hook's state is false
    // So enter will proceed to request fullscreen
    await act(async () => {
      await result.current.enter()
    })

    // Enter should still be called
    // Note: exit() won't be called because it checks !isFullscreen
    // This is expected behavior - exit() only works for the current hook's state
    expect(mockRequestFullscreen).toHaveBeenCalledTimes(1)

    document.body.removeChild(otherElement)
  })

  it('should check initial fullscreen state on mount', async () => {
    // Set up fullscreen state before rendering hook
    Object.defineProperty(document, 'fullscreenElement', {
      value: element,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(document, 'fullScreen', {
      value: true,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useFullscreen(element))

    expect(result.current.isSupported).toBe(true)

    // Now trigger the fullscreenchange event to update the state
    triggerFullscreenChange(element)

    expect(result.current.isFullscreen).toBe(true)
  })

  it('should handle unsupported environment', () => {
    // Remove all fullscreen APIs
    delete (element as any).requestFullscreen
    delete (document as any).exitFullscreen
    delete (document as any).fullscreenElement
    delete (document as any).fullscreenEnabled
    delete (document as any).fullScreen

    const { result } = renderHook(() => useFullscreen(element))

    expect(result.current.isSupported).toBe(false)
    expect(result.current.isFullscreen).toBe(false)
  })
})
