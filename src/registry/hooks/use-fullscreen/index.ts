import { useRef, useState } from 'react'
import { useEffectWithTarget } from '@/registry/hooks/use-effect-with-target'
import { useEventListener } from '@/registry/hooks/use-event-listener'
import { useIsomorphicLayoutEffect } from '@/registry/hooks/use-isomorphic-layout-effect'
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

function getTargetElement(target: BasicTarget<any>) {
  return getTargetElementUtil(target, document.documentElement)
}

function getProperties(target: BasicTarget<any>) {
  const targetElement = getTargetElement(target)

  const getRequestMethod = () => {
    const methods: RequestMethod[] = [
      'requestFullscreen',
      'webkitRequestFullscreen',
      'webkitEnterFullscreen',
      'webkitEnterFullScreen',
      'webkitRequestFullScreen',
      'mozRequestFullScreen',
      'msRequestFullscreen',
    ]

    return methods.find(
      (method) =>
        (targetElement && method in targetElement) ||
        (document && method in document),
    )
  }

  const getExitMethod = () => {
    const methods: ExitMethod[] = [
      'exitFullscreen',
      'webkitExitFullscreen',
      'webkitExitFullScreen',
      'webkitCancelFullScreen',
      'mozCancelFullScreen',
      'msExitFullscreen',
    ]

    return methods.find(
      (method) =>
        (targetElement && method in targetElement) ||
        (document && method in document),
    )
  }

  const getFullscreenEnabledProperty = () => {
    const properties: FullscreenEnabledProperty[] = [
      'fullScreen',
      'webkitIsFullScreen',
      'webkitDisplayingFullscreen',
      'mozFullScreen',
      'msFullscreenElement',
    ]

    return properties.find(
      (property) =>
        (document && property in document) ||
        (targetElement && property in targetElement),
    )
  }

  const getFullscreenElementProperty = () => {
    const properties: FullscreenElementProperty[] = [
      'fullscreenElement',
      'webkitFullscreenElement',
      'mozFullScreenElement',
      'msFullscreenElement',
    ]

    return properties.find(
      (property) =>
        (document && property in document) ||
        (targetElement && property in targetElement),
    )
  }

  return {
    requestMethod: getRequestMethod(),
    exitMethod: getExitMethod(),
    fullscreenEnabledProperty: getFullscreenEnabledProperty(),
    fullscreenElementProperty: getFullscreenElementProperty(),
  }
}

function getIsSupported(
  target: BasicTarget<any>,
  properties: ReturnType<typeof getProperties>,
) {
  const targetElement = getTargetElement(target)

  const { requestMethod, exitMethod, fullscreenEnabledProperty } = properties
  return !!(
    targetElement &&
    document &&
    requestMethod !== undefined &&
    exitMethod !== undefined &&
    fullscreenEnabledProperty !== undefined
  )
}

/**
 * Reactive Fullscreen API.
 *
 * @param target - The target element to make fullscreen. If not provided, uses document.documentElement
 * @param options - Configuration options
 */
export function useFullscreen(
  target?: BasicTarget<any>,
  options: UseFullscreenOptions = {},
) {
  const { autoExit = false } = options

  const properties = useRef<{
    requestMethod: RequestMethod | undefined
    exitMethod: ExitMethod | undefined
    fullscreenEnabledProperty: FullscreenEnabledProperty | undefined
    fullscreenElementProperty: FullscreenElementProperty | undefined
  }>({
    requestMethod: undefined,
    exitMethod: undefined,
    fullscreenEnabledProperty: undefined,
    fullscreenElementProperty: undefined,
  })
  const [isSupported, setIsSupported] = useState(() => {
    if (!isBrowser) return false

    return getIsSupported(target, getProperties(target))
  })
  const [isFullscreen, setIsFullscreen] = useState(false)

  const exit = useMemoizedFn(async () => {
    const { exitMethod } = properties.current
    if (!isSupported || !isFullscreen) return

    const element = getTargetElement(target)
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

  useEffectWithTarget(
    () => {
      if (!isBrowser) {
        return
      }

      properties.current = {
        ...getProperties(target),
      }

      setIsSupported(getIsSupported(target, properties.current))
    },
    [],
    target,
  )

  const isCurrentElementFullScreen = useMemoizedFn((): boolean => {
    const { fullscreenElementProperty } = properties.current
    if (!fullscreenElementProperty || !isBrowser) return false

    const element = getTargetElement(target)

    return document[fullscreenElementProperty as keyof Document] === element
  })

  const isElementFullScreen = useMemoizedFn((): boolean => {
    const { fullscreenEnabledProperty } = properties.current
    if (!fullscreenEnabledProperty || !isBrowser) return false

    const element = getTargetElement(target)
    const doc = document as any

    if (doc[fullscreenEnabledProperty] != null) {
      return Boolean(doc[fullscreenEnabledProperty])
    }

    // Fallback for WebKit and iOS Safari browsers
    if (element && (element as any)[fullscreenEnabledProperty] != null) {
      return Boolean((element as any)[fullscreenEnabledProperty])
    }

    return false
  })

  const enter = useMemoizedFn(async () => {
    const { requestMethod } = properties.current
    if (!isSupported || isFullscreen) return

    if (isElementFullScreen()) {
      await exit()
    }

    const element = getTargetElement(target)
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

  const listenerOptions = { capture: false, passive: true }
  // Listen to fullscreen change events on document
  useEventListener(eventHandlers as any, handlerCallback, {
    target: () => document,
    ...listenerOptions,
  })

  // Listen to fullscreen change events on target element
  useEventListener(eventHandlers as any, handlerCallback, {
    target: () => getTargetElement(target),
    ...listenerOptions,
  })

  // Check initial state on mount
  useIsomorphicLayoutEffect(() => {
    if (isBrowser) {
      handlerCallback()
    }
  }, [])

  useUnmount(() => {
    if (autoExit) exit()
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
