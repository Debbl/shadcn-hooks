import { isBrowser, isEqual, isFunction } from 'es-toolkit'
import { useRef } from 'react'
import { useUnmount } from '@/registry/hooks/use-unmount'
import type {
  DependencyList,
  EffectCallback,
  RefObject,
  useEffect,
  useLayoutEffect,
} from 'react'

type TargetValue<T> = T | undefined | null

type TargetType = HTMLElement | Element | Window | Document

export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | RefObject<TargetValue<T>>

export function getTargetElement<T extends TargetType>(
  target: BasicTarget<T>,
  defaultElement?: T,
) {
  if (!isBrowser) {
    return undefined
  }

  if (!target) {
    return defaultElement
  }

  let targetElement: TargetValue<T>

  if (isFunction(target)) {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }

  return targetElement
}

const createEffectWithTarget = (
  useEffectType: typeof useEffect | typeof useLayoutEffect,
) => {
  /**
   *
   * @param effect
   * @param deps
   * @param target target should compare ref.current vs ref.current, dom vs dom, ()=>dom vs ()=>dom
   */
  const useEffectWithTarget = (
    effect: EffectCallback,
    deps: DependencyList,
    target: BasicTarget<any> | BasicTarget<any>[],
  ) => {
    const hasInitRef = useRef(false)

    const lastElementRef = useRef<(Element | null)[]>([])
    const lastDepsRef = useRef<DependencyList>([])

    const unLoadRef = useRef<any>(undefined)

    useEffectType(() => {
      const targets = Array.isArray(target) ? target : [target]
      const els = targets.map((item) => getTargetElement(item))

      // init run
      if (!hasInitRef.current) {
        hasInitRef.current = true
        lastElementRef.current = els
        lastDepsRef.current = deps

        unLoadRef.current = effect()
        return
      }

      if (
        els.length !== lastElementRef.current.length ||
        !isEqual(lastElementRef.current, els) ||
        !isEqual(lastDepsRef.current, deps)
      ) {
        unLoadRef.current?.()

        lastElementRef.current = els
        lastDepsRef.current = deps
        unLoadRef.current = effect()
      }
    })

    useUnmount(() => {
      unLoadRef.current?.()
      // for react-refresh
      hasInitRef.current = false
    })
  }

  return useEffectWithTarget
}

export default createEffectWithTarget
