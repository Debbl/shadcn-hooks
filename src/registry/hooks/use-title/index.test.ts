import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTitle } from './index'

describe('useTitle', () => {
  let originalTitle: string
  let originalMutationObserver: typeof MutationObserver

  beforeEach(() => {
    originalTitle = document.title
    originalMutationObserver = MutationObserver
    document.title = 'Initial Title'
  })

  afterEach(() => {
    document.title = originalTitle
    globalThis.MutationObserver = originalMutationObserver
    vi.restoreAllMocks()
  })

  it('should return current document title by default', () => {
    const { result } = renderHook(() => useTitle())

    expect(result.current[0]).toBe('Initial Title')
  })

  it('should set initial title value to document', () => {
    const { result } = renderHook(() => useTitle('Dashboard'))

    expect(result.current[0]).toBe('Dashboard')
    expect(document.title).toBe('Dashboard')
  })

  it('should update title when setter is called', () => {
    const { result } = renderHook(() => useTitle('Page'))

    act(() => {
      result.current[1]('Settings')
    })

    expect(result.current[0]).toBe('Settings')
    expect(document.title).toBe('Settings')
  })

  it('should support functional updates', () => {
    const { result } = renderHook(() => useTitle('Page'))

    act(() => {
      result.current[1]((prevTitle) => `${prevTitle} 2`)
    })

    expect(result.current[0]).toBe('Page 2')
    expect(document.title).toBe('Page 2')
  })

  it('should apply string title template', () => {
    renderHook(() =>
      useTitle('Dashboard', {
        titleTemplate: '%s | Shadcn Hooks',
      }),
    )

    expect(document.title).toBe('Dashboard | Shadcn Hooks')
  })

  it('should apply function title template', () => {
    renderHook(() =>
      useTitle('Dashboard', {
        titleTemplate: (title) => `[${title}]`,
      }),
    )

    expect(document.title).toBe('[Dashboard]')
  })

  it('should sync with controlled title changes', () => {
    const { result, rerender } = renderHook(({ title }) => useTitle(title), {
      initialProps: { title: 'Overview' as string | null },
    })

    expect(result.current[0]).toBe('Overview')
    expect(document.title).toBe('Overview')

    rerender({ title: 'Profile' })

    expect(result.current[0]).toBe('Profile')
    expect(document.title).toBe('Profile')
  })

  it('should observe external document title changes', () => {
    let mutationCallback: MutationCallback | undefined

    globalThis.MutationObserver = class MockMutationObserver {
      constructor(callback: MutationCallback) {
        mutationCallback = callback
      }

      disconnect() {}

      observe() {}

      takeRecords() {
        return []
      }
    } as unknown as typeof MutationObserver

    const { result } = renderHook(() => useTitle(undefined, { observe: true }))

    act(() => {
      document.title = 'External Title'
      mutationCallback?.([], {} as MutationObserver)
    })

    expect(result.current[0]).toBe('External Title')
  })

  it('should not double-apply template when observe is enabled', () => {
    let mutationCallback: MutationCallback | undefined

    globalThis.MutationObserver = class MockMutationObserver {
      constructor(callback: MutationCallback) {
        mutationCallback = callback
      }

      disconnect() {}

      observe() {}

      takeRecords() {
        return []
      }
    } as unknown as typeof MutationObserver

    const { result } = renderHook(() =>
      useTitle('Home', {
        observe: true,
        titleTemplate: '%s | App',
      }),
    )

    expect(result.current[0]).toBe('Home')
    expect(document.title).toBe('Home | App')

    act(() => {
      result.current[1]('Settings')
      mutationCallback?.([], {} as MutationObserver)
    })

    expect(document.title).toBe('Settings | App')
    expect(result.current[0]).toBe('Settings')
  })

  it('should ignore repeated mutation callbacks from the same internal title update', () => {
    let mutationCallback: MutationCallback | undefined

    globalThis.MutationObserver = class MockMutationObserver {
      constructor(callback: MutationCallback) {
        mutationCallback = callback
      }

      disconnect() {}

      observe() {}

      takeRecords() {
        return []
      }
    } as unknown as typeof MutationObserver

    const { result } = renderHook(() =>
      useTitle('Home', {
        observe: true,
        titleTemplate: '%s | App',
      }),
    )

    expect(document.title).toBe('Home | App')
    expect(result.current[0]).toBe('Home')

    act(() => {
      result.current[1]('Settings')
      mutationCallback?.([], {} as MutationObserver)
      mutationCallback?.([], {} as MutationObserver)
      mutationCallback?.([], {} as MutationObserver)
    })

    expect(document.title).toBe('Settings | App')
    expect(result.current[0]).toBe('Settings')
  })

  it('should sync external title after internal title is set before observer callback', () => {
    let mutationCallback: MutationCallback | undefined

    globalThis.MutationObserver = class MockMutationObserver {
      constructor(callback: MutationCallback) {
        mutationCallback = callback
      }

      disconnect() {}

      observe() {}

      takeRecords() {
        return []
      }
    } as unknown as typeof MutationObserver

    const { result } = renderHook(() =>
      useTitle('Home', {
        observe: true,
        titleTemplate: '%s | App',
      }),
    )

    expect(document.title).toBe('Home | App')
    expect(result.current[0]).toBe('Home')

    act(() => {
      document.title = 'useTitle - Shadcn Hooks'
      mutationCallback?.([], {} as MutationObserver)
    })

    expect(result.current[0]).toBe('useTitle - Shadcn Hooks')
  })
})
