import { useCallback, useMemo, useState } from 'react'
import { useEventListener } from '@/registry/hooks/use-event-listener'
import { useIsomorphicLayoutEffect } from '@/registry/hooks/use-isomorphic-layout-effect'
import { useLatest } from '@/registry/hooks/use-latest'
import { useMemoizedFn } from '@/registry/hooks/use-memoized-fn'
import { useUnmount } from '@/registry/hooks/use-unmount'
import { getTargetElement as getTargetElementUtil } from '@/registry/lib/create-effect-with-target'
import { isBrowser } from '@/registry/lib/is-browser'
import type { BasicTarget } from '@/registry/lib/create-effect-with-target'

export interface UseFullscreenOptions {
  /**
   * Automatically exit fullscreen when component is unmounted
   *
   * @default false
   */
  autoExit?: boolean
}

const eventHandlers = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'webkitendfullscreen',
  'mozfullscreenchange',
  'MSFullscreenChange',
] as const

type RequestMethod =
  | 'requestFullscreen'
  | 'webkitRequestFullscreen'
  | 'webkitEnterFullscreen'
  | 'webkitEnterFullScreen'
  | 'webkitRequestFullScreen'
  | 'mozRequestFullScreen'
  | 'msRequestFullscreen'

type ExitMethod =
  | 'exitFullscreen'
  | 'webkitExitFullscreen'
  | 'webkitExitFullScreen'
  | 'webkitCancelFullScreen'
  | 'mozCancelFullScreen'
  | 'msExitFullscreen'

type FullscreenEnabledProperty =
  | 'fullScreen'
  | 'webkitIsFullScreen'
  | 'webkitDisplayingFullscreen'
  | 'mozFullScreen'
  | 'msFullscreenElement'

type FullscreenElementProperty =
  | 'fullscreenElement'
  | 'webkitFullscreenElement'
  | 'mozFullScreenElement'
  | 'msFullscreenElement'

/**
 * Reactive Fullscreen API.
 *
 * @param target - The target element to make fullscreen. If not provided, uses document.documentElement
 * @param options - Configuration options
 */
export function useFullscreen(
  target?: BasicTarget<HTMLElement | Element>,
  options: UseFullscreenOptions = {},
) {
  const { autoExit = false } = options

  const [isFullscreen, setIsFullscreen] = useState(false)
  const targetRef = useLatest(target)

  const getTargetElement = useMemoizedFn(() => {
    const element = getTargetElementUtil(
      targetRef.current,
      isBrowser ? document.documentElement : undefined,
    )
    return element
  })

  const requestMethod = useMemo<RequestMethod | undefined>(() => {
    if (!isBrowser) return undefined

    const methods: RequestMethod[] = [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'webkitEnterFullscreen',
      'webkitEnterFullScreen',
      'webkitRequestFullScreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
    ]

    const element = getTargetElement()
    for (const method of methods) {
      if (element && method in element) {
        return method
      }
      if (document && method in document) {
        return method
      }
    }

    return undefined
  }, [getTargetElement])

  const exitMethod = useMemo<ExitMethod | undefined>(() => {
    if (!isBrowser) return undefined

    const methods: ExitMethod[] = [
      'exitFullscreen',
      'webkitExitFullscreen',
      'webkitExitFullScreen',
      'webkitCancelFullScreen',
      'mozCancelFullScreen',
      'msExitFullscreen',
    ]

    const element = getTargetElement()
    for (const method of methods) {
      if (element && method in element) {
        return method
      }
      if (document && method in document) {
        return method
      }
    }

    return undefined
  }, [getTargetElement])

  const fullscreenEnabledProperty = useMemo<
    FullscreenEnabledProperty | undefined
  >(() => {
    if (!isBrowser) return undefined

    const properties: FullscreenEnabledProperty[] = [
      'fullScreen',
      'webkitIsFullScreen',
      'webkitDisplayingFullscreen',
      'mozFullScreen',
      'msFullscreenElement',
    ]

    const element = getTargetElement()
    for (const property of properties) {
      if (document && property in document) {
        return property
      }
      if (element && property in element) {
        return property
      }
    }

    return undefined
  }, [getTargetElement])

  const fullscreenElementProperty = useMemo<
    FullscreenElementProperty | undefined
  >(() => {
    if (!isBrowser) return undefined

    const properties: FullscreenElementProperty[] = [
      'fullscreenElement',
      'webkitFullscreenElement',
      'mozFullScreenElement',
      'msFullscreenElement',
    ]

    for (const property of properties) {
      if (document && property in document) {
        return property
      }
    }

    return undefined
  }, [])

  const isSupported = useMemo(() => {
    if (!isBrowser) return false
    const element = getTargetElement()
    return !!(
      element &&
      document &&
      requestMethod !== undefined &&
      exitMethod !== undefined &&
      fullscreenEnabledProperty !== undefined
    )
  }, [getTargetElement, requestMethod, exitMethod, fullscreenEnabledProperty])

  const isCurrentElementFullScreen = useCallback((): boolean => {
    if (!fullscreenElementProperty || !isBrowser) return false
    const element = getTargetElement()
    return document[fullscreenElementProperty as keyof Document] === element
  }, [fullscreenElementProperty, getTargetElement])

  const isElementFullScreen = useCallback((): boolean => {
    if (!fullscreenEnabledProperty || !isBrowser) return false

    const element = getTargetElement()
    const doc = document as any

    if (doc[fullscreenEnabledProperty] != null) {
      return Boolean(doc[fullscreenEnabledProperty])
    }

    // Fallback for WebKit and iOS Safari browsers
    if (element && (element as any)[fullscreenEnabledProperty] != null) {
      return Boolean((element as any)[fullscreenEnabledProperty])
    }

    return false
  }, [fullscreenEnabledProperty, getTargetElement])

  const exit = useMemoizedFn(async () => {
    if (!isSupported || !isFullscreen) return

    const element = getTargetElement()
    const doc = document as any

    if (exitMethod) {
      if (doc[exitMethod] != null) {
        await doc[exitMethod]()
      } else if (element && (element as any)[exitMethod] != null) {
        // Fallback for Safari iOS
        await (element as any)[exitMethod]()
      }
    }

    setIsFullscreen(false)
  })

  const enter = useMemoizedFn(async () => {
    if (!isSupported || isFullscreen) return

    if (isElementFullScreen()) {
      await exit()
    }

    const element = getTargetElement()
    if (requestMethod && element && (element as any)[requestMethod] != null) {
      await (element as any)[requestMethod]()
      setIsFullscreen(true)
    }
  })

  const toggle = useMemoizedFn(async () => {
    await (isFullscreen ? exit() : enter())
  })

  const handlerCallback = useMemoizedFn(() => {
    const isElementFullScreenValue = isElementFullScreen()
    if (
      !isElementFullScreenValue ||
      (isElementFullScreenValue && isCurrentElementFullScreen())
    ) {
      setIsFullscreen(isElementFullScreenValue)
    }
  })

  // Listen to fullscreen change events on document
  useEventListener(eventHandlers as any, handlerCallback, {
    target: () => document,
    passive: true,
  })

  // Listen to fullscreen change events on target element
  useEventListener(eventHandlers as any, handlerCallback, {
    target: () => getTargetElement(),
    passive: true,
  })

  // Check initial state on mount
  useIsomorphicLayoutEffect(() => {
    if (isBrowser) {
      handlerCallback()
    }
  }, [])

  // Auto exit on unmount if enabled
  useUnmount(() => {
    if (autoExit) {
      exit()
    }
  })

  return {
    isSupported,
    isFullscreen,
    enter,
    exit,
    toggle,
  }
}

export type UseFullscreenReturn = ReturnType<typeof useFullscreen>
