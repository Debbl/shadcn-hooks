import { useCallback, useEffect, useRef, useState } from 'react'
import { useEventListener } from '@/registry/hooks/use-event-listener'
import { useLatest } from '@/registry/hooks/use-latest'
import { getTargetElement } from '@/registry/lib/create-effect-with-target'
import type { BasicTarget } from '@/registry/lib/create-effect-with-target'

export type UseScrollTarget = BasicTarget<HTMLElement | Window>

export interface UseScrollOffset {
  left?: number
  right?: number
  top?: number
  bottom?: number
}

export interface UseScrollDirections {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
}

export interface UseScrollArrivedState {
  left: boolean
  right: boolean
  top: boolean
  bottom: boolean
}

export interface UseScrollOptions {
  /**
   * Throttle interval in milliseconds for scroll event handling.
   * @default 0
   */
  throttle?: number
  /**
   * Idle duration in milliseconds to detect when scrolling has stopped.
   * @default 200
   */
  idle?: number
  /**
   * Pixel offsets for boundary arrival detection.
   */
  offset?: UseScrollOffset
  /**
   * Callback fired on each scroll event.
   */
  onScroll?: (e: Event) => void
  /**
   * Callback fired when scrolling stops.
   */
  onStop?: (e: Event) => void
}

export interface UseScrollReturn {
  x: number
  y: number
  isScrolling: boolean
  directions: UseScrollDirections
  arrivedState: UseScrollArrivedState
  /**
   * Manually re-measure scroll position and arrival state.
   */
  measure: () => void
}

const IDLE_DIRECTIONS: UseScrollDirections = {
  left: false,
  right: false,
  up: false,
  down: false,
}

function readScrollInfo(el: Element | Window) {
  if (el === window) {
    return {
      x: window.scrollX,
      y: window.scrollY,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
    }
  }
  const elem = el as Element
  return {
    x: elem.scrollLeft,
    y: elem.scrollTop,
    scrollWidth: elem.scrollWidth,
    scrollHeight: elem.scrollHeight,
    clientWidth: elem.clientWidth,
    clientHeight: elem.clientHeight,
  }
}

/**
 * Reactive scroll position, direction, and boundary tracking for any scrollable target.
 *
 * @see https://shadcn-hooks.com/docs/hooks/use-scroll
 */
export function useScroll(
  target: UseScrollTarget = undefined,
  options: UseScrollOptions = {},
): UseScrollReturn {
  const { throttle: throttleMs = 0, idle = 200, offset = {} } = options

  const {
    left: offsetLeft = 0,
    right: offsetRight = 0,
    top: offsetTop = 0,
    bottom: offsetBottom = 0,
  } = offset

  const onScrollRef = useLatest(options.onScroll)
  const onStopRef = useLatest(options.onStop)

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [directions, setDirections] =
    useState<UseScrollDirections>(IDLE_DIRECTIONS)
  const [arrivedState, setArrivedState] = useState<UseScrollArrivedState>({
    left: true,
    right: false,
    top: true,
    bottom: false,
  })

  const prevPositionRef = useRef({ x: 0, y: 0 })
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastEventRef = useRef<Event | null>(null)

  const computeScroll = useCallback(() => {
    const el = getTargetElement(target, window as Window & typeof globalThis)
    if (!el) return

    const info = readScrollInfo(el as Element | Window)
    const prev = prevPositionRef.current

    const nextDirections: UseScrollDirections = {
      left: info.x < prev.x,
      right: info.x > prev.x,
      up: info.y < prev.y,
      down: info.y > prev.y,
    }

    const nextArrivedState: UseScrollArrivedState = {
      left: info.x <= offsetLeft,
      right: info.x + info.clientWidth >= info.scrollWidth - offsetRight,
      top: info.y <= offsetTop,
      bottom: info.y + info.clientHeight >= info.scrollHeight - offsetBottom,
    }

    prevPositionRef.current = { x: info.x, y: info.y }

    setX(info.x)
    setY(info.y)
    setDirections(nextDirections)
    setArrivedState(nextArrivedState)
  }, [target, offsetLeft, offsetRight, offsetTop, offsetBottom])

  const handleScroll = useCallback(
    (e: Event) => {
      lastEventRef.current = e
      onScrollRef.current?.(e)

      if (throttleMs > 0) {
        if (!throttleTimerRef.current) {
          throttleTimerRef.current = setTimeout(() => {
            throttleTimerRef.current = null
            computeScroll()
          }, throttleMs)
        }
      } else {
        computeScroll()
      }

      setIsScrolling(true)

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      idleTimerRef.current = setTimeout(() => {
        setIsScrolling(false)
        setDirections(IDLE_DIRECTIONS)
        if (lastEventRef.current) {
          onStopRef.current?.(lastEventRef.current)
        }
      }, idle)
    },
    [computeScroll, throttleMs, idle, onScrollRef, onStopRef],
  )

  // Measure on mount to capture initial scroll position
  useEffect(() => {
    computeScroll()
  }, [computeScroll])

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
        idleTimerRef.current = null
      }

      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current)
        throttleTimerRef.current = null
      }
    }
  }, [])

  useEventListener('scroll', handleScroll, {
    target: target as BasicTarget<HTMLElement>,
    passive: true,
  })

  const measure = useCallback(() => {
    computeScroll()
  }, [computeScroll])

  return { x, y, isScrolling, directions, arrivedState, measure }
}
