import { useEffectWithTarget } from '~/hooks/use-effect-with-target'
import { useLatest } from '~/hooks/use-latest'
import { getTargetElement } from '~/lib/create-effect-with-target'
import type { BasicTarget } from '~/lib/create-effect-with-target'

type DocumentEventKey = keyof DocumentEventMap

declare type TargetValue<T> = T | undefined | null

const checkIfAllInShadow = (targets: BasicTarget[]) => {
  return targets.every((item) => {
    const targetElement = getTargetElement(item)
    if (!targetElement) {
      return false
    }
    if (targetElement.getRootNode() instanceof ShadowRoot) {
      return true
    }
    return false
  })
}

const getShadow = (node: TargetValue<Element>) => {
  if (!node) {
    return document
  }
  return node.getRootNode()
}

const getDocumentOrShadow = (
  target: BasicTarget | BasicTarget[],
): Document | Node => {
  if (!target || !document.getRootNode) {
    return document
  }

  const targets = Array.isArray(target) ? target : [target]

  if (checkIfAllInShadow(targets)) {
    return getShadow(getTargetElement(targets[0]))
  }

  return document
}

export function useClickAway<T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName: DocumentEventKey | DocumentEventKey[] = 'click',
) {
  const onClickAwayRef = useLatest(onClickAway)

  useEffectWithTarget(
    () => {
      const handler = (event: any) => {
        const targets = Array.isArray(target) ? target : [target]
        if (
          targets.some((item) => {
            const targetElement = getTargetElement(item)
            return !targetElement || targetElement.contains(event.target)
          })
        ) {
          return
        }
        onClickAwayRef.current(event)
      }

      const documentOrShadow = getDocumentOrShadow(target)

      const eventNames = Array.isArray(eventName) ? eventName : [eventName]

      eventNames.forEach((event) =>
        documentOrShadow.addEventListener(event, handler),
      )

      return () => {
        eventNames.forEach((event) =>
          documentOrShadow.removeEventListener(event, handler),
        )
      }
    },
    Array.isArray(eventName) ? eventName : [eventName],
    target,
  )
}
