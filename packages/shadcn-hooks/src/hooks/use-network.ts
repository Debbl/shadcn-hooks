import { useCallback, useRef, useSyncExternalStore } from 'react'

export interface NetworkState {
  since?: Date
  online?: boolean
  rtt?: number
  type?: string
  downlink?: number
  saveData?: boolean
  downlinkMax?: number
  effectiveType?: string
}

function getConnection() {
  const nav = navigator as any
  if (typeof nav !== 'object') {
    return null
  }
  return nav.connection || nav.mozConnection || nav.webkitConnection
}

function getConnectionProperty(): NetworkState {
  const c = getConnection()
  if (!c) {
    return {}
  }
  return {
    rtt: c.rtt,
    type: c.type,
    saveData: c.saveData,
    downlink: c.downlink,
    downlinkMax: c.downlinkMax,
    effectiveType: c.effectiveType,
  }
}

function serverSnapshot() {
  return {
    since: undefined,
    online: true,
    ...getConnectionProperty(),
  }
}

function getInitialOnlineState(): boolean {
  if (typeof navigator !== 'object') {
    return true
  }
  return navigator.onLine
}

export function useNetwork() {
  const networkState = useRef<NetworkState>({
    since: undefined,
    online: getInitialOnlineState(),
    ...getConnectionProperty(),
  })

  const subscribe = useCallback((onStoreChange: () => void) => {
    const onOnline = () => {
      networkState.current = {
        ...networkState.current,
        since: new Date(),
        online: true,
        ...getConnectionProperty(),
      }
      onStoreChange()
    }

    const onOffline = () => {
      networkState.current = {
        ...networkState.current,
        since: new Date(),
        online: false,
        ...getConnectionProperty(),
      }
      onStoreChange()
    }

    const onConnectionChange = () => {
      networkState.current = {
        ...networkState.current,
        since: new Date(),
        ...getConnectionProperty(),
      }
      onStoreChange()
    }

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const connection = getConnection()
    connection?.addEventListener('change', onConnectionChange)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      connection?.removeEventListener('change', onConnectionChange)
    }
  }, [])

  const snapshot = useCallback(() => networkState.current, [])

  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
