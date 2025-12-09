import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useControllableValue } from './index'

describe('useControllableValue', () => {
  describe('standard Props (controlled)', () => {
    it('should work with controlled value', () => {
      const onChange = vi.fn()
      const { result, rerender } = renderHook(
        ({ value }) => useControllableValue({ value, onChange }),
        {
          initialProps: { value: 'initial', onChange },
        },
      )

      expect(result.current[0]).toBe('initial')

      rerender({ value: 'updated', onChange })
      expect(result.current[0]).toBe('updated')
    })

    it('should call onChange when setState is called', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue({ value: 'initial', onChange }),
      )

      act(() => {
        result.current[1]('new value')
      })

      expect(onChange).toHaveBeenCalledWith('new value')
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('should support function updater in controlled mode', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue<number>({ value: 10, onChange }),
      )

      act(() => {
        result.current[1]((prev) => prev + 5)
      })

      expect(onChange).toHaveBeenCalledWith(15)
    })

    it('should use undefined when value is explicitly undefined in controlled mode', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue({
          value: undefined,
          defaultValue: 'default',
          onChange,
        }),
      )

      // When value prop is provided (even if undefined), it's controlled mode
      // and should return undefined, not defaultValue
      expect(result.current[0]).toBeUndefined()
    })
  })

  describe('uncontrolled mode', () => {
    it('should work with defaultValue prop', () => {
      const { result } = renderHook(() =>
        useControllableValue({ defaultValue: 'default' }),
      )

      expect(result.current[0]).toBe('default')
    })

    it('should work with defaultValue in options', () => {
      const { result } = renderHook(() =>
        useControllableValue({}, { defaultValue: 'default' }),
      )

      expect(result.current[0]).toBe('default')
    })

    it('should update internal state when uncontrolled', () => {
      const { result } = renderHook(() =>
        useControllableValue({ defaultValue: 'initial' }),
      )

      expect(result.current[0]).toBe('initial')

      act(() => {
        result.current[1]('updated')
      })

      expect(result.current[0]).toBe('updated')
    })

    it('should call onChange callback when provided in uncontrolled mode', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue({ defaultValue: 'initial', onChange }),
      )

      act(() => {
        result.current[1]('new value')
      })

      expect(result.current[0]).toBe('new value')
      expect(onChange).toHaveBeenCalledWith('new value')
    })

    it('should support function updater in uncontrolled mode', () => {
      const { result } = renderHook(() =>
        useControllableValue<number>({ defaultValue: 10 }),
      )

      act(() => {
        result.current[1]((prev) => prev + 5)
      })

      expect(result.current[0]).toBe(15)
    })
  })

  describe('custom prop names', () => {
    it('should work with custom valuePropName', () => {
      const { result, rerender } = renderHook(
        ({ model }) =>
          useControllableValue({ model }, { valuePropName: 'model' }),
        {
          initialProps: { model: 'initial' },
        },
      )

      expect(result.current[0]).toBe('initial')

      rerender({ model: 'updated' })
      expect(result.current[0]).toBe('updated')
    })

    it('should work with custom defaultValuePropName', () => {
      const { result } = renderHook(() =>
        useControllableValue(
          { initialValue: 'default' },
          { defaultValuePropName: 'initialValue' },
        ),
      )

      expect(result.current[0]).toBe('default')
    })

    it('should work with custom trigger name', () => {
      const onInput = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue(
          { value: 'initial', onInput },
          { trigger: 'onInput' },
        ),
      )

      act(() => {
        result.current[1]('new value')
      })

      expect(onInput).toHaveBeenCalledWith('new value')
      expect(onInput).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should handle empty props object', () => {
      const { result } = renderHook(() => useControllableValue({}))

      expect(result.current[0]).toBeUndefined()
    })

    it('should handle null value', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue({ value: null, onChange }),
      )

      expect(result.current[0]).toBeNull()

      act(() => {
        result.current[1]('value')
      })

      expect(onChange).toHaveBeenCalledWith('value')
    })

    it('should handle boolean false value', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue({ value: false, onChange }),
      )

      expect(result.current[0]).toBe(false)
    })

    it('should handle number 0 value', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue({ value: 0, onChange }),
      )

      expect(result.current[0]).toBe(0)
    })

    it('should handle empty string value', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue({ value: '', onChange }),
      )

      expect(result.current[0]).toBe('')
    })

    it('should pass extra arguments to onChange', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue({ value: 'initial', onChange }),
      )

      act(() => {
        result.current[1]('new value', 'arg1', 'arg2')
      })

      expect(onChange).toHaveBeenCalledWith('new value', 'arg1', 'arg2')
    })

    it('should prioritize value over defaultValue in controlled mode', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableValue({
          value: 'controlled',
          defaultValue: 'default',
          onChange,
        }),
      )

      expect(result.current[0]).toBe('controlled')
    })

    it('should handle object values', () => {
      const onChange = vi.fn()
      const objValue = { name: 'test', count: 5 }
      const { result } = renderHook(() =>
        useControllableValue({ value: objValue, onChange }),
      )

      expect(result.current[0]).toEqual(objValue)

      const newObj = { name: 'updated', count: 10 }
      act(() => {
        result.current[1](newObj)
      })

      expect(onChange).toHaveBeenCalledWith(newObj)
    })

    it('should handle array values', () => {
      const onChange = vi.fn()
      const arrValue = [1, 2, 3]
      const { result } = renderHook(() =>
        useControllableValue({ value: arrValue, onChange }),
      )

      expect(result.current[0]).toEqual(arrValue)

      const newArr = [4, 5, 6]
      act(() => {
        result.current[1](newArr)
      })

      expect(onChange).toHaveBeenCalledWith(newArr)
    })
  })

  describe('function reference stability', () => {
    it('should return stable setState function reference', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useControllableValue({ value, onChange: vi.fn() }),
        {
          initialProps: { value: 'initial' },
        },
      )

      const setState1 = result.current[1]
      rerender({ value: 'updated' })
      const setState2 = result.current[1]

      expect(setState1).toBe(setState2)
    })
  })
})
