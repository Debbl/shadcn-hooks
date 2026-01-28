import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useScrollLock } from './index'

describe('useScrollLock', () => {
  let element: HTMLDivElement
  let originalOverflow: string
  let originalPaddingRight: string

  beforeEach(() => {
    element = document.createElement('div')
    element.style.overflow = 'auto'
    element.style.paddingRight = '0px'
    element.style.width = '200px'
    Object.defineProperty(element, 'offsetWidth', {
      writable: true,
      configurable: true,
      value: 200,
    })
    Object.defineProperty(element, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: 180,
    })
    document.body.appendChild(element)
    originalOverflow = document.body.style.overflow
    originalPaddingRight = document.body.style.paddingRight
  })

  afterEach(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element)
    }
    document.body.style.overflow = originalOverflow
    document.body.style.paddingRight = originalPaddingRight
    vi.restoreAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useScrollLock({ autoLock: false }))

    expect(result.current.isLocked).toBe(false)
    expect(typeof result.current.lock).toBe('function')
    expect(typeof result.current.unlock).toBe('function')
  })

  it('should auto lock on mount when autoLock is true', async () => {
    const { result } = renderHook(() => useScrollLock({ autoLock: true }))

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
      expect(document.body.style.overflow).toBe('hidden')
    })
  })

  it('should not auto lock when autoLock is false', () => {
    const { result } = renderHook(() => useScrollLock({ autoLock: false }))

    expect(result.current.isLocked).toBe(false)
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('should lock scroll', async () => {
    const { result } = renderHook(() => useScrollLock({ autoLock: false }))

    expect(result.current.isLocked).toBe(false)

    await act(async () => {
      result.current.lock()
    })

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
      expect(document.body.style.overflow).toBe('hidden')
    })
  })

  it('should unlock scroll', async () => {
    const { result } = renderHook(() => useScrollLock({ autoLock: true }))

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
    })

    await act(async () => {
      result.current.unlock()
    })

    expect(result.current.isLocked).toBe(false)
  })

  it('should lock and unlock specific element', async () => {
    const { result } = renderHook(() =>
      useScrollLock({ autoLock: false, lockTarget: element }),
    )

    await act(async () => {
      result.current.lock()
    })

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
      expect(element.style.overflow).toBe('hidden')
    })

    await act(async () => {
      result.current.unlock()
    })

    expect(result.current.isLocked).toBe(false)
    expect(element.style.overflow).toBe('auto')
  })

  it('should handle string selector as lockTarget', async () => {
    element.id = 'test-element'
    const { result } = renderHook(() =>
      useScrollLock({ autoLock: false, lockTarget: '#test-element' }),
    )

    await act(async () => {
      result.current.lock()
    })

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
      expect(element.style.overflow).toBe('hidden')
    })
  })

  it('should prevent width reflow when widthReflow is true', async () => {
    const { result } = renderHook(() =>
      useScrollLock({
        autoLock: false,
        lockTarget: element,
        widthReflow: true,
      }),
    )

    const originalPadding = element.style.paddingRight

    await act(async () => {
      result.current.lock()
    })

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
      // Padding should be increased to account for scrollbar
      expect(element.style.paddingRight).not.toBe(originalPadding)
    })

    await act(async () => {
      result.current.unlock()
    })

    expect(element.style.paddingRight).toBe(originalPadding)
  })

  it('should not prevent width reflow when widthReflow is false', async () => {
    const originalPadding = element.style.paddingRight

    const { result } = renderHook(() =>
      useScrollLock({
        autoLock: false,
        lockTarget: element,
        widthReflow: false,
      }),
    )

    await act(async () => {
      result.current.lock()
    })

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
      expect(element.style.overflow).toBe('hidden')
      // Padding should remain unchanged
      expect(element.style.paddingRight).toBe(originalPadding)
    })
  })

  it('should restore original styles on unmount', async () => {
    const { result, unmount } = renderHook(() =>
      useScrollLock({ autoLock: true }),
    )

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
      expect(document.body.style.overflow).toBe('hidden')
    })

    unmount()

    expect(document.body.style.overflow).toBe(originalOverflow)
  })

  it('should handle body as target with window.innerWidth', async () => {
    const { result } = renderHook(() =>
      useScrollLock({
        autoLock: false,
        lockTarget: document.body,
        widthReflow: true,
      }),
    )

    await act(async () => {
      result.current.lock()
    })

    await waitFor(() => {
      expect(result.current.isLocked).toBe(true)
      expect(document.body.style.overflow).toBe('hidden')
    })
  })

  it('should update when options change', async () => {
    const { result, rerender } = renderHook(
      ({ target }) => useScrollLock({ autoLock: false, lockTarget: target }),
      { initialProps: { target: element } },
    )

    await act(async () => {
      result.current.lock()
    })

    await waitFor(() => {
      expect(element.style.overflow).toBe('hidden')
    })

    const newElement = document.createElement('div')
    newElement.style.overflow = 'auto'
    document.body.appendChild(newElement)

    await act(async () => {
      result.current.unlock()
    })

    rerender({ target: newElement })

    await act(async () => {
      result.current.lock()
    })

    await waitFor(() => {
      expect(newElement.style.overflow).toBe('hidden')
    })

    document.body.removeChild(newElement)
  })
})
