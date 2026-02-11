# useDebounceEffect

Debounced `useEffect`. The effect only runs after the dependencies stop changing for the specified delay.

## Usage

```tsx
import { useDebounceEffect } from 'shadcn-hooks'

function Component() {
  const [search, setSearch] = useState('')

  useDebounceEffect(
    () => {
      fetchResults(search)
    },
    [search],
    500,
  )

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />
}
```

## Type Declarations

```ts
import type { DebounceOptions } from 'es-toolkit'

export function useDebounceEffect(
  effect: EffectCallback,
  deps: DependencyList,
  debounceMs?: number,
  options?: DebounceOptions,
): void
```

## Parameters

| Parameter    | Type              | Default | Description               |
| ------------ | ----------------- | ------- | ------------------------- |
| `effect`     | `EffectCallback`  | —       | Effect function to run    |
| `deps`       | `DependencyList`  | —       | Dependencies to watch     |
| `debounceMs` | `number`          | `1000`  | Debounce delay in ms      |
| `options`    | `DebounceOptions` | —       | Options from `es-toolkit` |
