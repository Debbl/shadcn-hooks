import { useCallback, useRef, useSyncExternalStore } from 'react'
import type { Dispatch, SetStateAction } from 'react'

const LOCAL_STORAGE_STATE_EVENT = 'shadcn-hooks:local-storage-state'
const inMemoryStorage = new Map<string, string>()

interface LocalStorageStateEventDetail {
  key: string
}

interface SnapshotCache<T> {
  raw: string | null
  value: T
}

export interface UseLocalStorageStateOptions<T> {
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
  onError?: (error: unknown) => void
}

export type UseLocalStorageStateReturn<T> = [
  T,
  Dispatch<SetStateAction<T>>,
  () => void,
]

function resolveInitialValue<T>(initialValue: T | (() => T)): T {
  return typeof initialValue === 'function'
    ? (initialValue as () => T)()
    : initialValue
}

function defaultSerializer<T>(value: T): string {
  const serializedValue = JSON.stringify(value)
  return serializedValue === undefined ? 'null' : serializedValue
}

function defaultDeserializer<T>(value: string): T {
  return JSON.parse(value) as T
}

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readStorageValue(key: string): string | null {
  const localStorage = getLocalStorage()
  if (!localStorage) {
    return inMemoryStorage.get(key) ?? null
  }

  return localStorage.getItem(key)
}

function writeStorageValue(key: string, value: string): void {
  const localStorage = getLocalStorage()
  if (!localStorage) {
    inMemoryStorage.set(key, value)
    return
  }

  localStorage.setItem(key, value)
}

function removeStorageValue(key: string): void {
  const localStorage = getLocalStorage()
  if (!localStorage) {
    inMemoryStorage.delete(key)
    return
  }

  localStorage.removeItem(key)
}

function emitLocalStorageStateEvent(key: string): void {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent<LocalStorageStateEventDetail>(LOCAL_STORAGE_STATE_EVENT, {
      detail: { key },
    }),
  )
}

/**
 * A SSR-safe localStorage state hook with same-tab and cross-tab synchronization.
 *
 * @param key - localStorage key
 * @param initialValue - Initial state value, used during SSR and when key does not exist
 * @param options - Optional serializer, deserializer, and error callback
 * @returns [state, setState, removeState]
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageStateOptions<T> = {},
): UseLocalStorageStateReturn<T> {
  const {
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
    onError,
  } = options

  const initialValueRef = useRef<T>(resolveInitialValue(initialValue))
  const cacheRef = useRef<SnapshotCache<T> | null>(null)

  const getSnapshot = useCallback((): T => {
    const rawValue = readStorageValue(key)

    if (rawValue === null) {
      const fallbackSnapshot: SnapshotCache<T> = {
        raw: null,
        value: initialValueRef.current,
      }
      cacheRef.current = fallbackSnapshot
      return fallbackSnapshot.value
    }

    const cachedSnapshot = cacheRef.current
    if (cachedSnapshot?.raw === rawValue) {
      return cachedSnapshot.value
    }

    try {
      const parsedValue = deserializer(rawValue)
      cacheRef.current = {
        raw: rawValue,
        value: parsedValue,
      }
      return parsedValue
    } catch (error) {
      onError?.(error)
      const fallbackSnapshot: SnapshotCache<T> = {
        raw: rawValue,
        value: initialValueRef.current,
      }
      cacheRef.current = fallbackSnapshot
      return fallbackSnapshot.value
    }
  }, [deserializer, key, onError])

  const getServerSnapshot = useCallback(() => initialValueRef.current, [])

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined') {
        return () => {}
      }

      const localStorage = getLocalStorage()

      const onStorage = (event: StorageEvent) => {
        if (!localStorage || event.storageArea !== localStorage) {
          return
        }
        if (event.key !== key && event.key !== null) {
          return
        }
        onStoreChange()
      }

      const onLocalStorageState = (event: Event) => {
        const customEvent = event as CustomEvent<LocalStorageStateEventDetail>
        if (customEvent.detail?.key !== key) {
          return
        }
        onStoreChange()
      }

      window.addEventListener('storage', onStorage)
      window.addEventListener(LOCAL_STORAGE_STATE_EVENT, onLocalStorageState)

      return () => {
        window.removeEventListener('storage', onStorage)
        window.removeEventListener(
          LOCAL_STORAGE_STATE_EVENT,
          onLocalStorageState,
        )
      }
    },
    [key],
  )

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setState: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      const currentValue = getSnapshot()
      const nextValue =
        typeof value === 'function'
          ? (value as (previousState: T) => T)(currentValue)
          : value

      try {
        const rawValue = serializer(nextValue)
        writeStorageValue(key, rawValue)
        cacheRef.current = { raw: rawValue, value: nextValue }
        emitLocalStorageStateEvent(key)
      } catch (error) {
        onError?.(error)
      }
    },
    [getSnapshot, key, onError, serializer],
  )

  const removeState = useCallback(() => {
    try {
      removeStorageValue(key)
      cacheRef.current = { raw: null, value: initialValueRef.current }
      emitLocalStorageStateEvent(key)
    } catch (error) {
      onError?.(error)
    }
  }, [key, onError])

  return [state, setState, removeState]
}
