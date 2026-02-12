import { useSyncExternalStore } from 'react'

const DEFAULT_VISIBILITY_STATE: DocumentVisibilityState = 'visible'

function subscribe(onStoreChange: () => void) {
  if (typeof document === 'undefined') {
    return () => {}
  }

  document.addEventListener('visibilitychange', onStoreChange, {
    passive: true,
  })

  return () => {
    document.removeEventListener('visibilitychange', onStoreChange)
  }
}

function getSnapshot(): DocumentVisibilityState {
  if (typeof document === 'undefined') {
    return DEFAULT_VISIBILITY_STATE
  }

  return document.visibilityState
}

function getServerSnapshot(): DocumentVisibilityState {
  return DEFAULT_VISIBILITY_STATE
}

/**
 * Reactively track `document.visibilityState`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
 * @returns The current document visibility state.
 */
export function useDocumentVisibility(): DocumentVisibilityState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
