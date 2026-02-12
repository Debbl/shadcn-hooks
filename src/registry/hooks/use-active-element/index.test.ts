import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useActiveElement } from './index'

describe('useActiveElement', () => {
  let input: HTMLInputElement
  let button: HTMLButtonElement

  beforeEach(() => {
    input = document.createElement('input')
    button = document.createElement('button')
    document.body.append(input, button)
  })

  afterEach(() => {
    input.remove()
    button.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('should return the current active element', () => {
    act(() => {
      input.focus()
    })

    const { result } = renderHook(() => useActiveElement())

    expect(result.current).toBe(input)
  })

  it('should update when focus changes', () => {
    const { result } = renderHook(() => useActiveElement())

    act(() => {
      input.focus()
    })
    expect(result.current).toBe(input)

    act(() => {
      button.focus()
    })
    expect(result.current).toBe(button)
  })

  it('should subscribe and unsubscribe focus/blur events in capture phase', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useActiveElement())

    expect(addSpy).toHaveBeenCalledWith('focus', expect.any(Function), true)
    expect(addSpy).toHaveBeenCalledWith('blur', expect.any(Function), true)

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('focus', expect.any(Function), true)
    expect(removeSpy).toHaveBeenCalledWith('blur', expect.any(Function), true)
  })

  it('should ignore blur update when relatedTarget is not null', () => {
    let currentActiveElement: Element | null = input
    vi.spyOn(document, 'activeElement', 'get').mockImplementation(() => {
      return currentActiveElement
    })

    const { result } = renderHook(() => useActiveElement())

    expect(result.current).toBe(input)

    act(() => {
      currentActiveElement = document.body
      window.dispatchEvent(
        new FocusEvent('blur', {
          relatedTarget: button,
        }),
      )
    })

    expect(result.current).toBe(input)
  })

  it('should resolve deepest active element by default', () => {
    const host = document.createElement('div')
    const shadowRoot = host.attachShadow({ mode: 'open' })
    const shadowInput = document.createElement('input')
    shadowRoot.append(shadowInput)
    document.body.append(host)

    act(() => {
      shadowInput.focus()
    })

    const { result } = renderHook(() => useActiveElement())
    expect(result.current).toBe(shadowInput)

    host.remove()
  })

  it('should return host element when deep is false', () => {
    const host = document.createElement('div')
    const shadowRoot = host.attachShadow({ mode: 'open' })
    const shadowInput = document.createElement('input')
    shadowRoot.append(shadowInput)
    document.body.append(host)

    act(() => {
      shadowInput.focus()
    })

    const { result } = renderHook(() => useActiveElement({ deep: false }))
    expect(result.current).toBe(host)

    host.remove()
  })

  it('should observe DOM removal when triggerOnRemoval is true', () => {
    const observe = vi.fn()
    const disconnect = vi.fn()
    let mutationCallback: MutationCallback | undefined

    class MockMutationObserver {
      constructor(callback: MutationCallback) {
        mutationCallback = callback
      }

      disconnect = disconnect
      observe = observe
      takeRecords = vi.fn<() => MutationRecord[]>(() => [])
    }

    vi.stubGlobal(
      'MutationObserver',
      MockMutationObserver as unknown as typeof MutationObserver,
    )

    let currentActiveElement: Element | null = input
    vi.spyOn(document, 'activeElement', 'get').mockImplementation(() => {
      return currentActiveElement
    })

    const { result, unmount } = renderHook(() =>
      useActiveElement({ triggerOnRemoval: true }),
    )

    expect(result.current).toBe(input)
    expect(observe).toHaveBeenCalledWith(document, {
      childList: true,
      subtree: true,
    })

    act(() => {
      currentActiveElement = document.body
      mutationCallback?.([], {} as MutationObserver)
    })

    expect(result.current).toBe(document.body)

    unmount()
    expect(disconnect).toHaveBeenCalledTimes(1)
  })
})
