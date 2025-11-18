import { useEffectWithTarget } from '@/registry/hooks/use-effect-with-target'
import { useLatest } from '@/registry/hooks/use-latest'
import { getTargetElement } from '@/registry/lib/create-effect-with-target'
import type { BasicTarget } from '@/registry/lib/create-effect-with-target'

type noop = (...p: any) => void

export type Target = BasicTarget<HTMLElement | Element | Window | Document>

interface Options<T extends Target = Target> {
  target?: T
  capture?: boolean
  once?: boolean
  passive?: boolean
  enable?: boolean
}

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>,
): void
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>,
): void
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>,
): void
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>,
): void
function useEventListener(
  eventName: string | string[],
  handler: (event: Event) => void,
  options?: Options<Window>,
): void
function useEventListener(
  eventName: string | string[],
  handler: noop,
  options: Options,
): void

function useEventListener(
  eventName: string | string[],
  handler: noop,
  options: Options = {},
) {
  const { enable = true } = options

  const handlerRef = useLatest(handler)

  useEffectWithTarget(
    () => {
      if (!enable) {
        return
      }

      const targetElement = getTargetElement(options.target, window)
      if (!targetElement?.addEventListener) {
        return
      }

      const eventListener = (event: Event) => {
        return handlerRef.current(event)
      }

      const eventNameArray = Array.isArray(eventName) ? eventName : [eventName]

      eventNameArray.forEach((event) => {
        targetElement.addEventListener(event, eventListener, {
          capture: options.capture,
          once: options.once,
          passive: options.passive,
        })
      })

      return () => {
        eventNameArray.forEach((event) => {
          targetElement.removeEventListener(event, eventListener, {
            capture: options.capture,
          })
        })
      }
    },
    [eventName, options.capture, options.once, options.passive, enable],
    options.target,
  )
}

export { useEventListener }
