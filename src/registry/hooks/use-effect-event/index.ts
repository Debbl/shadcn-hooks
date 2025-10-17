import * as React from 'react'
import { createContext, useCallback, useInsertionEffect, useRef } from 'react'

const context = createContext(true)

function forbiddenInRender() {
  throw new Error(
    "A function wrapped in useEffectEvent can't be called during rendering.",
  )
}

// We can only check if we're in a render phase, beyond initial render, in React 19, with its `React.use` hook.
const isInvalidExecutionContextForEventFunction =
  'use' in React
    ? () => {
        // There's no way to check if we're in a render phase from outside of React, the API used by useEffectEvent is private: https://github.com/facebook/react/blob/a00ca6f6b51e46a0ccec54a2231bfe7a1ed9ae1d/packages/react-reconciler/src/ReactFiberWorkLoop.js#L1785-L1788
        // So to emulate the same behavior, we call the use hook and if it doesn't throw, we're in a render phase.
        try {
          return React.use(context)
        } catch {
          return false
        }
      }
    : () => false

/**
 * This is a ponyfill of the upcoming `useEffectEvent` hook that'll arrive in React 19.
 * https://19.react.dev/learn/separating-events-from-effects#declaring-an-effect-event
 * To learn more about the ponyfill itself, see: https://blog.bitsrc.io/a-look-inside-the-useevent-polyfill-from-the-new-react-docs-d1c4739e8072
 * @public
 */
export function useEffectEvent<const T extends (...args: any[]) => void>(
  fn: T,
): T {
  /**
   * For both React 18 and 19 we set the ref to the forbiddenInRender function, to catch illegal calls to the function during render.
   * Once the insertion effect runs, we set the ref to the actual function.
   */
  const ref = useRef(forbiddenInRender as T)

  useInsertionEffect(() => {
    ref.current = fn
  }, [fn])

  return useCallback((...args: any) => {
    // Performs a similar check to what React does for `useEffectEvent`:
    // 1. https://github.com/facebook/react/blob/b7e2de632b2a160bc09edda1fbb9b8f85a6914e8/packages/react-reconciler/src/ReactFiberHooks.js#L2729-L2733
    // 2. https://github.com/facebook/react/blob/b7e2de632b2a160bc09edda1fbb9b8f85a6914e8/packages/react-reconciler/src/ReactFiberHooks.js#L2746C9-L2750
    if (isInvalidExecutionContextForEventFunction()) {
      forbiddenInRender()
    }

    const latestFn = ref.current!
    return latestFn(...args)
  }, []) as T
}
