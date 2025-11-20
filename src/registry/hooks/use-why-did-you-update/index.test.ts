import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWhyDidYouUpdate } from './index'

describe('useWhyDidYouUpdate', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  it('should log on initial render (from empty to props)', () => {
    renderHook(() => {
      useWhyDidYouUpdate('TestComponent', { name: 'test', count: 0 })
    })

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[why-did-you-update]',
      'TestComponent',
      {
        name: {
          from: undefined,
          to: 'test',
        },
        count: {
          from: undefined,
          to: 0,
        },
      },
    )
  })

  it('should log when props change', () => {
    const { rerender } = renderHook(
      ({ props }) => {
        useWhyDidYouUpdate('TestComponent', props)
      },
      {
        initialProps: { props: { name: 'test', count: 0 } },
      },
    )

    // Initial render logs all props (from {} to props)
    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    consoleLogSpy.mockClear()

    act(() => {
      rerender({ props: { name: 'test', count: 1 } })
    })

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[why-did-you-update]',
      'TestComponent',
      {
        count: {
          from: 0,
          to: 1,
        },
      },
    )
  })

  it('should log multiple changed props', () => {
    const { rerender } = renderHook(
      ({ props }) => {
        useWhyDidYouUpdate('TestComponent', props)
      },
      {
        initialProps: { props: { name: 'test', count: 0, active: false } },
      },
    )

    // Clear initial render log
    consoleLogSpy.mockClear()

    act(() => {
      rerender({
        props: { name: 'updated', count: 5, active: true },
      })
    })

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[why-did-you-update]',
      'TestComponent',
      {
        name: {
          from: 'test',
          to: 'updated',
        },
        count: {
          from: 0,
          to: 5,
        },
        active: {
          from: false,
          to: true,
        },
      },
    )
  })

  it('should not log when props do not change', () => {
    const { rerender } = renderHook(
      ({ props }) => {
        useWhyDidYouUpdate('TestComponent', props)
      },
      {
        initialProps: { props: { name: 'test', count: 0 } },
      },
    )

    // Clear initial render log
    consoleLogSpy.mockClear()

    act(() => {
      rerender({ props: { name: 'test', count: 0 } })
    })

    expect(consoleLogSpy).not.toHaveBeenCalled()
  })

  it('should handle new props being added', () => {
    const { rerender } = renderHook(
      ({ props }) => {
        useWhyDidYouUpdate('TestComponent', props)
      },
      {
        initialProps: { props: { name: 'test' } as Record<string, any> },
      },
    )

    // Clear initial render log
    consoleLogSpy.mockClear()

    act(() => {
      rerender({ props: { name: 'test', count: 0 } as Record<string, any> })
    })

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[why-did-you-update]',
      'TestComponent',
      {
        count: {
          from: undefined,
          to: 0,
        },
      },
    )
  })

  it('should handle props being removed', () => {
    const { rerender } = renderHook(
      ({ props }) => {
        useWhyDidYouUpdate('TestComponent', props)
      },
      {
        initialProps: {
          props: { name: 'test', count: 0 } as Record<string, any>,
        },
      },
    )

    // Clear initial render log
    consoleLogSpy.mockClear()

    act(() => {
      rerender({ props: { name: 'test' } as Record<string, any> })
    })

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[why-did-you-update]',
      'TestComponent',
      {
        count: {
          from: 0,
          to: undefined,
        },
      },
    )
  })

  it('should use Object.is for comparison', () => {
    const { rerender } = renderHook(
      ({ props }) => {
        useWhyDidYouUpdate('TestComponent', props)
      },
      {
        initialProps: { props: { value: Number.NaN } },
      },
    )

    // Clear initial render log
    consoleLogSpy.mockClear()

    act(() => {
      rerender({ props: { value: Number.NaN } })
    })

    // NaN === NaN is false, but Object.is(NaN, NaN) is true, so no log
    expect(consoleLogSpy).not.toHaveBeenCalled()
  })

  it('should handle empty props object', () => {
    const { rerender } = renderHook(
      ({ props }) => {
        useWhyDidYouUpdate('TestComponent', props)
      },
      {
        initialProps: { props: {} },
      },
    )

    // Initial render with empty props should not log ({} to {})
    expect(consoleLogSpy).not.toHaveBeenCalled()

    act(() => {
      rerender({ props: { name: 'test' } })
    })

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[why-did-you-update]',
      'TestComponent',
      {
        name: {
          from: undefined,
          to: 'test',
        },
      },
    )
  })
})
