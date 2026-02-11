# useDebounce

Returns a debounced version of a value. The debounced value only updates after the specified delay has passed without new changes.

## Usage

```tsx
import { useDebounce } from '@/hooks/use-debounce'

function Component() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    // Only fires 500ms after user stops typing
    fetchResults(debouncedSearch)
  }, [debouncedSearch])

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />
}
```

## Type Declarations

```ts
import type { DebounceOptions } from 'es-toolkit'

export function useDebounce<T>(
  value: T,
  debounceMs?: number,
  options?: DebounceOptions,
): T
```

## Parameters

| Parameter    | Type              | Default | Description                                   |
| ------------ | ----------------- | ------- | --------------------------------------------- |
| `value`      | `T`               | —       | The value to debounce                         |
| `debounceMs` | `number`          | `1000`  | Debounce delay in milliseconds                |
| `options`    | `DebounceOptions` | —       | Options from `es-toolkit` (e.g. `{ signal }`) |

## Returns

| Type | Description         |
| ---- | ------------------- |
| `T`  | The debounced value |
