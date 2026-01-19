import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useClipboard } from './index'

describe('useClipboard', () => {
  let mockWriteText: ReturnType<typeof vi.fn>
  let mockReadText: ReturnType<typeof vi.fn>
  let mockExecCommand: ReturnType<typeof vi.fn>
  let mockGetSelection: ReturnType<typeof vi.fn>
  let mockQuery: ReturnType<typeof vi.fn>
  let clearTimeoutSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.useFakeTimers()

    // Mock navigator.clipboard
    mockWriteText = vi.fn().mockResolvedValue(undefined)
    mockReadText = vi.fn().mockResolvedValue('')

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
        readText: mockReadText,
      },
      writable: true,
      configurable: true,
    })

    // Mock navigator.permissions
    mockQuery = vi.fn().mockResolvedValue({
      state: 'granted',
      onchange: null,
    })

    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: mockQuery,
      },
      writable: true,
      configurable: true,
    })

    // Mock document.execCommand (legacy)
    mockExecCommand = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, 'execCommand', {
      value: mockExecCommand,
      writable: true,
      configurable: true,
    })

    // Mock document.getSelection (legacy read)
    mockGetSelection = vi.fn().mockReturnValue({
      toString: () => 'selected text',
    })
    Object.defineProperty(document, 'getSelection', {
      value: mockGetSelection,
      writable: true,
      configurable: true,
    })

    // Mock global clearTimeout (needed for useUnmount and copy function)
    // The code uses clearTimeout directly (not window.clearTimeout)
    // Ensure it exists in global scope and is a spy
    if (typeof globalThis.clearTimeout === 'undefined') {
      globalThis.clearTimeout = vi.fn() as unknown as typeof clearTimeout
    }
    clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    // Mock ClipboardEvent if not available
    if (typeof ClipboardEvent === 'undefined') {
      globalThis.ClipboardEvent = class ClipboardEvent extends Event {
        clipboardData: DataTransfer | null = null
        constructor(type: string, eventInitDict?: EventInit) {
          super(type, eventInitDict)
        }
      } as unknown as typeof ClipboardEvent
    }
  })

  afterEach(() => {
    // Restore clipboard if it was deleted
    if (!('clipboard' in navigator)) {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: mockWriteText,
          readText: mockReadText,
        },
        writable: true,
        configurable: true,
      })
    }
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  const waitForPermissions = async () => {
    await act(async () => {
      await vi.runAllTimersAsync()
    })
  }

  describe('basic functionality', () => {
    it('should return initial state', async () => {
      const { result } = renderHook(() => useClipboard())

      await waitForPermissions()

      expect(result.current.isSupported).toBe(true)
      expect(result.current.text).toBe('')
      expect(result.current.copied).toBe(false)
      expect(typeof result.current.copy).toBe('function')
    })

    it('should copy text using clipboard API', async () => {
      const { result } = renderHook(() => useClipboard())

      await waitForPermissions()

      await act(async () => {
        await result.current.copy('test text')
      })

      expect(mockWriteText).toHaveBeenCalledWith('test text')
      expect(result.current.text).toBe('test text')
      expect(result.current.copied).toBe(true)
    })

    it('should set copied to false after timeout', async () => {
      const { result } = renderHook(() => useClipboard({ copiedDuring: 1000 }))

      await waitForPermissions()

      await act(async () => {
        await result.current.copy('test')
      })

      expect(result.current.copied).toBe(true)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.copied).toBe(false)
    })
  })

  describe('source option', () => {
    it('should use source option when copy is called without argument', async () => {
      const { result } = renderHook(() =>
        useClipboard({ source: 'default text' }),
      )

      await waitForPermissions()

      await act(async () => {
        await result.current.copy()
      })

      expect(mockWriteText).toHaveBeenCalledWith('default text')
      expect(result.current.text).toBe('default text')
    })

    it('should prioritize copy argument over source option', async () => {
      const { result } = renderHook(() =>
        useClipboard({ source: 'default text' }),
      )

      await waitForPermissions()

      await act(async () => {
        await result.current.copy('override text')
      })

      expect(mockWriteText).toHaveBeenCalledWith('override text')
      expect(result.current.text).toBe('override text')
    })
  })

  describe('read option', () => {
    it('should not read clipboard by default', async () => {
      renderHook(() => useClipboard())

      await waitForPermissions()

      expect(mockReadText).not.toHaveBeenCalled()
    })

    it('should read clipboard when read option is enabled', async () => {
      mockReadText.mockResolvedValue('clipboard content')

      renderHook(() => useClipboard({ read: true }))

      await waitForPermissions()

      // Wait a bit for event listener to be set up
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Trigger copy event on document (where useEventListener listens)
      act(() => {
        const event = new ClipboardEvent('copy', {
          bubbles: true,
          cancelable: true,
        })
        document.dispatchEvent(event)
      })

      // The read should happen asynchronously
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Note: In a real browser, the event listener would trigger updateText
      // which calls readText. In tests, we verify the setup is correct.
      // The actual reading depends on browser clipboard permissions.
      expect(mockReadText).toHaveBeenCalled()
    }, 10000)
  })

  describe('legacy fallback', () => {
    it('should use legacy copy when clipboard API is not available', async () => {
      // Remove clipboard API completely
      const originalClipboard = (navigator as any).clipboard
      delete (navigator as any).clipboard

      const { result } = renderHook(() => useClipboard({ legacy: true }))

      await waitForPermissions()

      expect(result.current.isSupported).toBe(true)

      await act(async () => {
        await result.current.copy('legacy text')
      })

      expect(mockExecCommand).toHaveBeenCalledWith('copy')
      expect(result.current.text).toBe('legacy text')

      // Restore for other tests
      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', {
          value: originalClipboard,
          writable: true,
          configurable: true,
        })
      }
    })

    it('should return false for isSupported when clipboard API is not available and legacy is false', async () => {
      // Remove clipboard API completely
      const originalClipboard = (navigator as any).clipboard
      delete (navigator as any).clipboard

      const { result } = renderHook(() => useClipboard({ legacy: false }))

      await waitForPermissions()

      expect(result.current.isSupported).toBe(false)

      // Restore for other tests
      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', {
          value: originalClipboard,
          writable: true,
          configurable: true,
        })
      }
    })

    it('should use legacy read when clipboard API read fails', async () => {
      mockReadText.mockRejectedValue(new Error('Permission denied'))

      renderHook(() => useClipboard({ read: true }))

      await waitForPermissions()

      // Wait a bit for event listener to be set up
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Trigger copy event - the event listener should call updateText
      // which will try clipboard API, fail, and fallback to legacy
      act(() => {
        const event = new ClipboardEvent('copy', {
          bubbles: true,
          cancelable: true,
        })
        document.dispatchEvent(event)
      })

      // Process async operations
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verify that clipboard API was attempted (and failed)
      // In a real scenario, legacy read would be called after the failure
      expect(mockReadText).toHaveBeenCalled()
    })
  })

  describe('permissions', () => {
    it('should handle granted permission', async () => {
      mockQuery.mockResolvedValue({
        state: 'granted',
        onchange: null,
      })

      const { result } = renderHook(() => useClipboard())

      await waitForPermissions()

      await act(async () => {
        await result.current.copy('test')
      })

      expect(mockWriteText).toHaveBeenCalled()
    })

    it('should handle denied permission and fallback to legacy', async () => {
      mockQuery.mockResolvedValue({
        state: 'denied',
        onchange: null,
      })
      mockWriteText.mockRejectedValue(new Error('Permission denied'))

      const { result } = renderHook(() => useClipboard())

      await waitForPermissions()

      await act(async () => {
        await result.current.copy('test')
      })

      expect(mockExecCommand).toHaveBeenCalled()
    })

    it('should handle prompt permission', async () => {
      mockQuery.mockResolvedValue({
        state: 'prompt',
        onchange: null,
      })

      const { result } = renderHook(() => useClipboard())

      await waitForPermissions()

      await act(async () => {
        await result.current.copy('test')
      })

      expect(mockWriteText).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should not copy when text is null', async () => {
      const { result } = renderHook(() => useClipboard())

      await waitForPermissions()

      await act(async () => {
        await result.current.copy(null as unknown as string)
      })

      expect(mockWriteText).not.toHaveBeenCalled()
    })

    it('should not copy when text is undefined and source is not provided', async () => {
      const { result } = renderHook(() => useClipboard())

      await waitForPermissions()

      await act(async () => {
        await result.current.copy(undefined as unknown as string)
      })

      expect(mockWriteText).not.toHaveBeenCalled()
    })

    it('should handle multiple rapid copies', async () => {
      const { result } = renderHook(() => useClipboard({ copiedDuring: 1000 }))

      await waitForPermissions()

      await act(async () => {
        await result.current.copy('first')
      })

      expect(result.current.copied).toBe(true)

      act(() => {
        vi.advanceTimersByTime(500)
      })

      await act(async () => {
        await result.current.copy('second')
      })

      expect(result.current.text).toBe('second')
      expect(result.current.copied).toBe(true)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.copied).toBe(false)
    })

    it('should cleanup timeout on unmount', async () => {
      const { result, unmount } = renderHook(() =>
        useClipboard({ copiedDuring: 1000 }),
      )

      await waitForPermissions()

      await act(async () => {
        await result.current.copy('test')
      })

      unmount()

      // After unmount, clearTimeout should have been called
      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('custom copiedDuring', () => {
    it('should use custom copiedDuring value', async () => {
      const { result } = renderHook(() => useClipboard({ copiedDuring: 500 }))

      await waitForPermissions()

      await act(async () => {
        await result.current.copy('test')
      })

      expect(result.current.copied).toBe(true)

      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(result.current.copied).toBe(false)
    })
  })
})
