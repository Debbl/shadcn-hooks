import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useBoolean } from './index'

const setUp = (val: boolean = false) =>
  renderHook((state) => useBoolean(state), { initialProps: val })

describe('useBoolean', () => {
  it('should return default value', () => {
    const { result } = setUp()
    const [value] = result.current

    expect(value).toBe(false)
  })

  it('should set the value', () => {
    const { result } = setUp(false)
    const [_, { set }] = result.current

    act(() => {
      set(true)
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      set(false)
    })

    expect(result.current[0]).toBe(false)
  })

  it('should set the value to true', () => {
    const { result } = setUp()
    const [_, { setTrue }] = result.current

    act(() => {
      setTrue()
    })

    expect(result.current[0]).toBe(true)
  })

  it('should set the value to false', () => {
    const { result } = setUp(true)
    const [_, { setFalse }] = result.current

    act(() => {
      setFalse()
    })

    expect(result.current[0]).toBe(false)
  })

  it('should toggle the value', () => {
    const { result } = setUp(true)
    const [_, { toggle }] = result.current

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe(false)

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe(true)
  })
})
