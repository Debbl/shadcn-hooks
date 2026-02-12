import { useCallback, useSyncExternalStore } from 'react'

export interface UseActiveElementOptions {
  /**
   * Whether to resolve the deepest focused node inside open shadow roots.
   * @default true
   */
  deep?: boolean
  /**
   * Whether to re-check active element when DOM nodes are removed.
   * @default false
   */
  triggerOnRemoval?: boolean
}

function resolveActiveElement(deep: boolean): Element | null {
  if (typeof document === 'undefined') {
    return null
  }

  let activeElement: Element | null = document.activeElement

  if (!deep) {
    return activeElement
  }

  while (activeElement?.shadowRoot?.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement
  }

  return activeElement
}

export function useActiveElement<T extends Element = HTMLElement>(
  options: UseActiveElementOptions = {},
): T | null {
  const { deep = true, triggerOnRemoval = false } = options

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined') {
        return () => {}
      }

      const onFocus = () => {
        onStoreChange()
      }
      const onBlur = (event: FocusEvent) => {
        if (event.relatedTarget !== null) {
          return
        }
        onStoreChange()
      }

      window.addEventListener('focus', onFocus, true)
      window.addEventListener('blur', onBlur, true)

      const observer =
        triggerOnRemoval && typeof MutationObserver !== 'undefined'
          ? new MutationObserver(() => {
              onStoreChange()
            })
          : null

      observer?.observe(document, {
        childList: true,
        subtree: true,
      })

      return () => {
        window.removeEventListener('focus', onFocus, true)
        window.removeEventListener('blur', onBlur, true)
        observer?.disconnect()
      }
    },
    [triggerOnRemoval],
  )

  const getSnapshot = useCallback(() => {
    return resolveActiveElement(deep) as T | null
  }, [deep])

  const getServerSnapshot = useCallback(() => {
    return null as T | null
  }, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
