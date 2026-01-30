import { act, renderHook } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTextSelection } from './index'

function createMockSelection(
  text: string,
  rect: DOMRect = new DOMRect(10, 20, 100, 30),
) {
  return {
    toString: () => text,
    rangeCount: text ? 1 : 0,
    getRangeAt: () => ({
      getBoundingClientRect: () => rect,
    }),
    removeAllRanges: vi.fn(),
  } as unknown as Selection
}

describe('useTextSelection', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    container.textContent = 'Select me please'
    document.body.appendChild(container)
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.removeChild(container)
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state with empty text and NaN rect when no target', () => {
      const { result } = renderHook(() => useTextSelection())

      expect(result.current.text).toBe('')
      expect(result.current.top).toBeNaN()
      expect(result.current.left).toBeNaN()
      expect(result.current.width).toBeNaN()
      expect(result.current.height).toBeNaN()
    })

    it('should return initial state with empty text when target is ref', () => {
      const ref = createRef<HTMLDivElement>()
      ref.current = container

      const { result } = renderHook(() => useTextSelection(ref))

      expect(result.current.text).toBe('')
    })
  })

  describe('selection inside target', () => {
    it('should update state with selected text and rect on mouseup after mousedown inside', () => {
      const ref = createRef<HTMLDivElement>()
      ref.current = container
      const rect = new DOMRect(10, 20, 100, 30)
      const mockSelection = createMockSelection('hello', rect)

      const getSelectionSpy = vi
        .spyOn(window, 'getSelection')
        .mockReturnValue(mockSelection)

      const { result } = renderHook(() => useTextSelection(ref))

      expect(result.current.text).toBe('')

      act(() => {
        const mousedownEvent = new MouseEvent('mousedown', {
          bubbles: true,
          button: 0,
        })
        container.dispatchEvent(mousedownEvent)
      })

      act(() => {
        const mouseupEvent = new MouseEvent('mouseup', { bubbles: true })
        container.dispatchEvent(mouseupEvent)
      })

      expect(result.current.text).toBe('hello')
      expect(result.current.top).toBe(20)
      expect(result.current.left).toBe(10)
      expect(result.current.width).toBe(100)
      expect(result.current.height).toBe(30)
      expect(result.current.right).toBe(110)
      expect(result.current.bottom).toBe(50)

      getSelectionSpy.mockRestore()
    })

    it('should not update state on mouseup when selection is empty', () => {
      const ref = createRef<HTMLDivElement>()
      ref.current = container
      const mockSelection = createMockSelection('')

      vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection)

      const { result } = renderHook(() => useTextSelection(ref))

      act(() => {
        container.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            button: 0,
          }),
        )
      })
      act(() => {
        container.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      })

      expect(result.current.text).toBe('')
    })
  })

  describe('mousedown outside target', () => {
    it('should clear state when mousedown happens outside target', () => {
      const ref = createRef<HTMLDivElement>()
      ref.current = container
      const rect = new DOMRect(10, 20, 100, 30)
      const mockSelection = createMockSelection('hello', rect)

      vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection)

      const { result } = renderHook(() => useTextSelection(ref))

      act(() => {
        container.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            button: 0,
          }),
        )
      })
      act(() => {
        container.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      })
      expect(result.current.text).toBe('hello')

      act(() => {
        const outside = document.createElement('div')
        document.body.appendChild(outside)
        document.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            button: 0,
          }),
        )
        document.body.removeChild(outside)
      })

      expect(result.current.text).toBe('')
    })

    it('should not clear state on right click (button 2) inside target', () => {
      const ref = createRef<HTMLDivElement>()
      ref.current = container
      const mockSelection = createMockSelection(
        'hello',
        new DOMRect(10, 20, 100, 30),
      )

      vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection)

      const { result } = renderHook(() => useTextSelection(ref))

      act(() => {
        container.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            button: 0,
          }),
        )
      })
      act(() => {
        container.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      })
      expect(result.current.text).toBe('hello')

      act(() => {
        container.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            button: 2,
          }),
        )
      })

      expect(result.current.text).toBe('hello')
    })
  })

  describe('target types', () => {
    it('should work with ref object', () => {
      const ref = createRef<HTMLDivElement>()
      ref.current = container
      const mockSelection = createMockSelection('ref', new DOMRect(1, 2, 3, 4))

      vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection)

      const { result } = renderHook(() => useTextSelection(ref))

      act(() => {
        container.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            button: 0,
          }),
        )
      })
      act(() => {
        container.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      })

      expect(result.current.text).toBe('ref')
      expect(result.current.left).toBe(1)
      expect(result.current.top).toBe(2)
    })

    it('should work with element directly', () => {
      const mockSelection = createMockSelection(
        'element',
        new DOMRect(5, 6, 7, 8),
      )

      vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection)

      const { result } = renderHook(() => useTextSelection(container))

      act(() => {
        container.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            button: 0,
          }),
        )
      })
      act(() => {
        container.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      })

      expect(result.current.text).toBe('element')
      expect(result.current.left).toBe(5)
      expect(result.current.top).toBe(6)
    })

    it('should work with function that returns element', () => {
      const mockSelection = createMockSelection('fn', new DOMRect(0, 0, 50, 20))

      vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection)

      const { result } = renderHook(() => useTextSelection(() => container))

      act(() => {
        container.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            button: 0,
          }),
        )
      })
      act(() => {
        container.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      })

      expect(result.current.text).toBe('fn')
    })
  })

  describe('edge cases', () => {
    it('should not throw when target is null', () => {
      const ref = createRef<HTMLDivElement>()

      expect(() => {
        renderHook(() => useTextSelection(ref))
      }).not.toThrow()
    })

    it('should not update state on mouseup when mousedown was outside target', () => {
      const ref = createRef<HTMLDivElement>()
      ref.current = container
      const mockSelection = createMockSelection(
        'outside',
        new DOMRect(0, 0, 10, 10),
      )

      vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection)

      const { result } = renderHook(() => useTextSelection(ref))

      act(() => {
        const outside = document.createElement('div')
        document.body.appendChild(outside)
        document.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            button: 0,
          }),
        )
        document.body.removeChild(outside)
      })
      act(() => {
        container.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      })

      expect(result.current.text).toBe('')
    })
  })

  describe('cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const ref = createRef<HTMLDivElement>()
      ref.current = container
      const addSpy = vi.spyOn(container, 'addEventListener')
      const removeSpy = vi.spyOn(container, 'removeEventListener')
      const docAddSpy = vi.spyOn(document, 'addEventListener')
      const docRemoveSpy = vi.spyOn(document, 'removeEventListener')

      const { unmount } = renderHook(() => useTextSelection(ref))

      expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
      expect(docAddSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))

      unmount()

      expect(removeSpy).toHaveBeenCalledWith('mouseup', expect.any(Function))
      expect(docRemoveSpy).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
      )

      addSpy.mockRestore()
      removeSpy.mockRestore()
      docAddSpy.mockRestore()
      docRemoveSpy.mockRestore()
    })
  })
})
