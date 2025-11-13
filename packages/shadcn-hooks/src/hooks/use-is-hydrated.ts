import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 *
 * Example: Disable a button that needs JS to work.
 * ```tsx
 * const isHydrated = useIsHydrated();
 * return (
 *   <button type="button" disabled={!isHydrated} onClick={doSomethingCustom}>
 *     Click me
 *   </button>
 * );
 * ```
 */
export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
