import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import useToggle from './index'

const setUp = (defaultValue?: any, reverseValue?: any) =>
  renderHook((props) => useToggle(props.defaultValue, props.reverseValue), {
    initialProps: { defaultValue, reverseValue },
  })

describe('useToggle', () => {
  it('should return default value (false)', () => {
    const { result } = setUp()
    const [value] = result.current

    expect(value).toBe(false)
  })

  it('should return initial value', () => {
    const { result } = setUp('left')
    const [value] = result.current

    expect(value).toBe('left')
  })

  it('should toggle between default values', () => {
    const { result } = setUp()
    const [_, { toggle }] = result.current

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe(false)
  })

  it('should toggle between custom values', () => {
    const { result } = setUp('left', 'right')
    const [_, { toggle }] = result.current

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe('right')

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe('left')
  })

  it('should set specific value', () => {
    const { result } = setUp('left', 'right')
    const [_, { set }] = result.current

    act(() => {
      set('right')
    })

    expect(result.current[0]).toBe('right')

    act(() => {
      set('left')
    })

    expect(result.current[0]).toBe('left')
  })

  it('should set left value', () => {
    const { result } = setUp('left', 'right')
    const [_, { setLeft }] = result.current

    act(() => {
      setLeft()
    })

    expect(result.current[0]).toBe('left')
  })

  it('should set right value', () => {
    const { result } = setUp('left', 'right')
    const [_, { setRight }] = result.current

    act(() => {
      setRight()
    })

    expect(result.current[0]).toBe('right')
  })

  it('should handle single value toggle', () => {
    const { result } = setUp('left')
    const [_, { toggle }] = result.current

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe(false)

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe('left')
  })
})
