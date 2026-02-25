import { useState } from 'react'
import { useEventListener } from '@/registry/hooks/use-event-listener'

export type UseMouseCoordType = 'page' | 'client' | 'screen' | 'movement'
export type UseMouseSourceType = 'mouse' | 'touch' | null

export interface UseMouseInitialValue {
  x: number
  y: number
}

export interface UseMouseState extends UseMouseInitialValue {
  sourceType: UseMouseSourceType
}

export interface UseMouseOptions {
  type?: UseMouseCoordType
  touch?: boolean
  resetOnTouchEnds?: boolean
  initialValue?: UseMouseInitialValue
  window?: Window
}

type MouseCoordKey =
  | 'pageX'
  | 'pageY'
  | 'clientX'
  | 'clientY'
  | 'screenX'
  | 'screenY'
  | 'movementX'
  | 'movementY'
type TouchCoordKey =
  | 'pageX'
  | 'pageY'
  | 'clientX'
  | 'clientY'
  | 'screenX'
  | 'screenY'
type TouchCoordType = Exclude<UseMouseCoordType, 'movement'>

const DEFAULT_INITIAL_VALUE: UseMouseInitialValue = {
  x: 0,
  y: 0,
}

const MOUSE_X_COORD_KEY_BY_TYPE: Record<UseMouseCoordType, MouseCoordKey> = {
  page: 'pageX',
  client: 'clientX',
  screen: 'screenX',
  movement: 'movementX',
}

const MOUSE_Y_COORD_KEY_BY_TYPE: Record<UseMouseCoordType, MouseCoordKey> = {
  page: 'pageY',
  client: 'clientY',
  screen: 'screenY',
  movement: 'movementY',
}

const TOUCH_X_COORD_KEY_BY_TYPE: Record<TouchCoordType, TouchCoordKey> = {
  page: 'pageX',
  client: 'clientX',
  screen: 'screenX',
}

const TOUCH_Y_COORD_KEY_BY_TYPE: Record<TouchCoordType, TouchCoordKey> = {
  page: 'pageY',
  client: 'clientY',
  screen: 'screenY',
}

function readMousePosition(
  event: MouseEvent,
  type: UseMouseCoordType,
): UseMouseInitialValue {
  const xKey = MOUSE_X_COORD_KEY_BY_TYPE[type]
  const yKey = MOUSE_Y_COORD_KEY_BY_TYPE[type]

  return {
    x: event[xKey],
    y: event[yKey],
  }
}

function readTouchPosition(
  touchPoint: Touch,
  type: UseMouseCoordType,
): UseMouseInitialValue {
  if (type === 'movement') {
    return {
      x: touchPoint.clientX,
      y: touchPoint.clientY,
    }
  }

  const xKey = TOUCH_X_COORD_KEY_BY_TYPE[type]
  const yKey = TOUCH_Y_COORD_KEY_BY_TYPE[type]

  return {
    x: touchPoint[xKey],
    y: touchPoint[yKey],
  }
}

/**
 * Reactive mouse position with optional touch support.
 *
 * @see https://shadcn-hooks.com/docs/hooks/use-mouse
 */
export function useMouse(options: UseMouseOptions = {}): UseMouseState {
  const {
    type = 'page',
    touch = true,
    resetOnTouchEnds = false,
    initialValue = DEFAULT_INITIAL_VALUE,
    window: customWindow,
  } = options

  const [state, setState] = useState<UseMouseState>(() => ({
    x: initialValue.x,
    y: initialValue.y,
    sourceType: null,
  }))

  const targetWindow =
    customWindow ?? (typeof window === 'undefined' ? undefined : window)
  const enable = Boolean(targetWindow)

  const updateFromMouseEvent = (event: MouseEvent) => {
    const nextPosition = readMousePosition(event, type)
    setState((prev) => ({
      ...prev,
      ...nextPosition,
      sourceType: 'mouse',
    }))
  }

  const updateFromTouchEvent = (event: TouchEvent) => {
    const touchPoint = event.touches[0] ?? event.changedTouches[0]
    if (!touchPoint) {
      return
    }

    const nextPosition = readTouchPosition(touchPoint, type)
    setState((prev) => ({
      ...prev,
      ...nextPosition,
      sourceType: 'touch',
    }))
  }

  const resetPosition = () => {
    setState((prev) => ({
      ...prev,
      x: initialValue.x,
      y: initialValue.y,
    }))
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (resetOnTouchEnds) {
      resetPosition()
      return
    }

    updateFromTouchEvent(event)
  }

  useEventListener('mousemove', updateFromMouseEvent, {
    target: targetWindow,
    passive: true,
    enable,
  })

  useEventListener('dragover', updateFromMouseEvent, {
    target: targetWindow,
    passive: true,
    enable,
  })

  useEventListener('touchstart', updateFromTouchEvent, {
    target: targetWindow,
    passive: true,
    enable: enable && touch,
  })

  useEventListener('touchmove', updateFromTouchEvent, {
    target: targetWindow,
    passive: true,
    enable: enable && touch,
  })

  useEventListener('touchend', handleTouchEnd, {
    target: targetWindow,
    passive: true,
    enable: enable && touch,
  })

  return state
}
