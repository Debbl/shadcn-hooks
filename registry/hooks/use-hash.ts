import { useSyncExternalStore } from 'react'

function subscribe(onStoreChange: () => void) {
  window.addEventListener('hashchange', onStoreChange)
  return () => window.removeEventListener('hashchange', onStoreChange)
}

function getSnapshot() {
  return window.location.hash
}

function getServerSnapshot() {
  return ''
}

export function useHash() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
