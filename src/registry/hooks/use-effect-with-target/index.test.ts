import { act, renderHook } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffectWithTarget } from './index'

describe('useEffectWithTarget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic functionality', () => {
    it('should run effect on initial mount', () => {
      const effect = vi.fn()
      const element = document.createElement('div')

      renderHook(() => {
        useEffectWithTarget(effect, [], element)
      })

      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('should run cleanup on unmount', () => {
      const cleanup = vi.fn()
      const effect = vi.fn().mockImplementation(() => cleanup)
      const element = document.createElement('div')

      const { unmount } = renderHook(() => {
        useEffectWithTarget(effect, [], element)
      })

      expect(effect).toHaveBeenCalledTimes(1)

      act(() => {
        unmount()
      })

      expect(cleanup).toHaveBeenCalledTimes(1)
    })

    it('should re-run effect when deps change', () => {
      const effect = vi.fn()
      const element = document.createElement('div')

      const { rerender } = renderHook(
        ({ dep }) => {
          useEffectWithTarget(effect, [dep], element)
        },
        {
          initialProps: { dep: 0 },
        },
      )

      expect(effect).toHaveBeenCalledTimes(1)

      act(() => {
        rerender({ dep: 1 })
      })

      expect(effect).toHaveBeenCalledTimes(2)
    })

    it('should not re-run effect when deps do not change', () => {
      const effect = vi.fn()
      const element = document.createElement('div')

      const { rerender } = renderHook(
        ({ dep }) => {
          useEffectWithTarget(effect, [dep], element)
        },
        {
          initialProps: { dep: 0 },
        },
      )

      expect(effect).toHaveBeenCalledTimes(1)

      act(() => {
        rerender({ dep: 0 })
      })

      expect(effect).toHaveBeenCalledTimes(1)
    })
  })

  describe('target types', () => {
    it('should work with DOM element', () => {
      const effect = vi.fn()
      const element = document.createElement('div')

      renderHook(() => {
        useEffectWithTarget(effect, [], element)
      })

      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('should work with ref object', () => {
      const effect = vi.fn()
      const element = document.createElement('div')
      const elementRef = createRef<HTMLDivElement>()
      elementRef.current = element

      renderHook(() => {
        useEffectWithTarget(effect, [], elementRef)
      })

      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('should work with function that returns element', () => {
      const effect = vi.fn()
      const element = document.createElement('div')
      const getElement = () => element

      renderHook(() => {
        useEffectWithTarget(effect, [], getElement)
      })

      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('should work with null/undefined target', () => {
      const effect = vi.fn()

      renderHook(() => {
        useEffectWithTarget(effect, [], null)
      })

      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('should work with ref that is initially null', () => {
      const effect = vi.fn()
      const elementRef = createRef<HTMLDivElement>()

      renderHook(() => {
        useEffectWithTarget(effect, [], elementRef)
      })

      expect(effect).toHaveBeenCalledTimes(1)
    })
  })

  describe('target changes', () => {
    it('should re-run effect when target element changes', () => {
      const cleanup = vi.fn()
      const effect = vi.fn().mockImplementation(() => cleanup)
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')

      const { rerender } = renderHook(
        ({ element }) => {
          useEffectWithTarget(effect, [], element)
        },
        {
          initialProps: { element: element1 },
        },
      )

      expect(effect).toHaveBeenCalledTimes(1)
      expect(cleanup).not.toHaveBeenCalled()

      act(() => {
        rerender({ element: element2 })
      })

      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)
    })

    it('should re-run effect when ref.current changes', () => {
      const cleanup = vi.fn()
      const effect = vi.fn().mockImplementation(() => cleanup)
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')
      const elementRef = createRef<HTMLDivElement>()
      elementRef.current = element1

      const { rerender } = renderHook(() => {
        useEffectWithTarget(effect, [], elementRef)
      })

      expect(effect).toHaveBeenCalledTimes(1)

      act(() => {
        elementRef.current = element2
        rerender()
      })

      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)
    })

    it('should re-run effect when function target changes', () => {
      const cleanup = vi.fn()
      const effect = vi.fn().mockImplementation(() => cleanup)
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')
      const getElement1 = () => element1
      const getElement2 = () => element2

      const { rerender } = renderHook(
        ({ getElement }) => {
          useEffectWithTarget(effect, [], getElement)
        },
        {
          initialProps: { getElement: getElement1 },
        },
      )

      expect(effect).toHaveBeenCalledTimes(1)

      act(() => {
        rerender({ getElement: getElement2 })
      })

      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)
    })
  })

  describe('array targets', () => {
    it('should work with array of targets', () => {
      const effect = vi.fn()
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')

      renderHook(() => {
        useEffectWithTarget(effect, [], [element1, element2])
      })

      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('should re-run effect when array length changes', () => {
      const cleanup = vi.fn()
      const effect = vi.fn().mockImplementation(() => cleanup)
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')

      const { rerender } = renderHook(
        ({ elements }) => {
          useEffectWithTarget(effect, [], elements)
        },
        {
          initialProps: { elements: [element1] },
        },
      )

      expect(effect).toHaveBeenCalledTimes(1)

      act(() => {
        rerender({ elements: [element1, element2] })
      })

      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)
    })

    it('should re-run effect when array element changes', () => {
      const cleanup = vi.fn()
      const effect = vi.fn().mockImplementation(() => cleanup)
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')
      const element3 = document.createElement('div')

      const { rerender } = renderHook(
        ({ elements }) => {
          useEffectWithTarget(effect, [], elements)
        },
        {
          initialProps: { elements: [element1, element2] },
        },
      )

      expect(effect).toHaveBeenCalledTimes(1)

      act(() => {
        rerender({ elements: [element1, element3] })
      })

      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(effect).toHaveBeenCalledTimes(2)
    })
  })

  describe('edge cases', () => {
    it('should handle effect that returns undefined', () => {
      const effect = vi.fn().mockReturnValue(undefined)
      const element = document.createElement('div')

      const { unmount } = renderHook(() => {
        useEffectWithTarget(effect, [], element)
      })

      expect(effect).toHaveBeenCalledTimes(1)

      act(() => {
        unmount()
      })

      // Should not throw
      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple useEffectWithTarget calls', () => {
      const effect1 = vi.fn()
      const effect2 = vi.fn()
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')

      renderHook(() => {
        useEffectWithTarget(effect1, [], element1)
        useEffectWithTarget(effect2, [], element2)
      })

      expect(effect1).toHaveBeenCalledTimes(1)
      expect(effect2).toHaveBeenCalledTimes(1)
    })

    it('should handle empty deps array', () => {
      const effect = vi.fn()
      const element = document.createElement('div')

      const { rerender } = renderHook(() => {
        useEffectWithTarget(effect, [], element)
      })

      expect(effect).toHaveBeenCalledTimes(1)

      act(() => {
        rerender()
      })

      // Should not re-run when deps are empty and don't change
      expect(effect).toHaveBeenCalledTimes(1)
    })

    it('should handle target that returns null', () => {
      const effect = vi.fn()
      const getNull = () => null

      renderHook(() => {
        useEffectWithTarget(effect, [], getNull)
      })

      expect(effect).toHaveBeenCalledTimes(1)
    })
  })
})
