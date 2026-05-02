# useLocalStorageState

Persist state in `localStorage` with SSR-safe snapshots and automatic same-tab / cross-tab synchronization.

## Usage

```tsx
import { useLocalStorageState } from '@/hooks/use-local-storage-state'

function Component() {
  const [theme, setTheme, removeTheme] = useLocalStorageState('theme', 'light')

  return (
    <div>
      <p>Theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button
        onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      >
        Toggle
      </button>
      <button onClick={removeTheme}>Reset</button>
    </div>
  )
}
```

## Type Declarations

```ts
import type { Dispatch, SetStateAction } from 'react'

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

export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T),
  options?: UseLocalStorageStateOptions<T>,
): UseLocalStorageStateReturn<T>
```

## Parameters

| Parameter      | Type                             | Default | Description                                               |
| -------------- | -------------------------------- | ------- | --------------------------------------------------------- |
| `key`          | `string`                         | -       | The `localStorage` key                                    |
| `initialValue` | `T \| (() => T)`                 | -       | Fallback value during SSR or when storage value is absent |
| `options`      | `UseLocalStorageStateOptions<T>` | `{}`    | Serializer, deserializer, and optional error callback     |

## Returns

| Type                             | Description                                          |
| -------------------------------- | ---------------------------------------------------- |
| `[value, setValue, removeValue]` | Current value, React-style updater, and clear method |
