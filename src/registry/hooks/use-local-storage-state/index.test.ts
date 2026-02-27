import { act, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorageState } from './index'

const createKey = (name: string) =>
  `use-local-storage-state:${name}:${Math.random().toString(36).slice(2)}`

describe('useLocalStorageState', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()

    if (typeof window !== 'undefined') {
      window.localStorage.clear()
    }
  })

  it('should return initial value when localStorage is empty', () => {
    const key = createKey('initial')
    const { result } = renderHook(() =>
      useLocalStorageState<string>(key, 'initial'),
    )

    expect(result.current[0]).toBe('initial')
  })

  it('should return value from localStorage when key exists', () => {
    const key = createKey('existing')
    window.localStorage.setItem(key, JSON.stringify('stored'))

    const { result } = renderHook(() =>
      useLocalStorageState<string>(key, 'initial'),
    )

    expect(result.current[0]).toBe('stored')
  })

  it('should set value and persist to localStorage', () => {
    const key = createKey('set')
    const { result } = renderHook(() =>
      useLocalStorageState<string>(key, 'initial'),
    )

    act(() => {
      result.current[1]('next')
    })

    expect(result.current[0]).toBe('next')
    expect(window.localStorage.getItem(key)).toBe(JSON.stringify('next'))
  })

  it('should support function updates', () => {
    const key = createKey('updater')
    const { result } = renderHook(() =>
      useLocalStorageState<string>(key, 'initial'),
    )

    act(() => {
      result.current[1]((previousState) => `${previousState}-next`)
    })

    expect(result.current[0]).toBe('initial-next')
    expect(window.localStorage.getItem(key)).toBe(
      JSON.stringify('initial-next'),
    )
  })

  it('should remove value from localStorage and reset to initial value', () => {
    const key = createKey('remove')
    window.localStorage.setItem(key, JSON.stringify('stored'))

    const { result } = renderHook(() =>
      useLocalStorageState<string>(key, 'initial'),
    )

    expect(result.current[0]).toBe('stored')

    act(() => {
      result.current[2]()
    })

    expect(result.current[0]).toBe('initial')
    expect(window.localStorage.getItem(key)).toBeNull()
  })

  it('should sync state between hook instances in the same tab', () => {
    const key = createKey('same-tab')
    const hookA = renderHook(() => useLocalStorageState<string>(key, 'initial'))
    const hookB = renderHook(() => useLocalStorageState<string>(key, 'initial'))

    act(() => {
      hookA.result.current[1]('shared')
    })

    expect(hookA.result.current[0]).toBe('shared')
    expect(hookB.result.current[0]).toBe('shared')
  })

  it('should update state when a storage event is dispatched', () => {
    const key = createKey('storage-event')
    const { result } = renderHook(() =>
      useLocalStorageState<string>(key, 'initial'),
    )

    act(() => {
      const rawValue = JSON.stringify('external-update')
      window.localStorage.setItem(key, rawValue)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: rawValue,
          storageArea: window.localStorage,
        }),
      )
    })

    expect(result.current[0]).toBe('external-update')
  })

  it('should fallback to initial value when deserialization fails', () => {
    const key = createKey('invalid-json')
    const onError = vi.fn<(error: unknown) => void>()
    window.localStorage.setItem(key, '{invalid-json}')

    const { result } = renderHook(() =>
      useLocalStorageState<string>(key, 'fallback', { onError }),
    )

    expect(result.current[0]).toBe('fallback')
    expect(onError).toHaveBeenCalled()
  })

  it('should support custom serializer and deserializer', () => {
    const key = createKey('custom-serde')
    const serializer = vi.fn((value: string) => value.toUpperCase())
    const deserializer = vi.fn((value: string) => value.toLowerCase())

    window.localStorage.setItem(key, 'PERSISTED')

    const { result } = renderHook(() =>
      useLocalStorageState<string>(key, 'initial', {
        serializer,
        deserializer,
      }),
    )

    expect(result.current[0]).toBe('persisted')

    act(() => {
      result.current[1]('next')
    })

    expect(window.localStorage.getItem(key)).toBe('NEXT')
  })

  it('should render safely when window is unavailable (SSR)', () => {
    const key = createKey('ssr')
    const originalWindow = window

    vi.stubGlobal('window', undefined)

    try {
      const Component = () => {
        const [value] = useLocalStorageState<string>(key, 'server-value')
        return createElement('span', null, value)
      }

      const html = renderToString(createElement(Component))
      expect(html).toContain('server-value')
    } finally {
      vi.stubGlobal('window', originalWindow)
    }
  })
})
