# useLatest

Ref that always holds the latest value. Useful for accessing the current value inside callbacks or effects without adding it to the dependency array.

## Usage

```tsx
import { useLatest } from 'shadcn-hooks'

function Component({ value }: { value: number }) {
  const latestValue = useLatest(value)

  useEffect(() => {
    const timer = setInterval(() => {
      // Always reads the latest value, no stale closures
      console.log(latestValue.current)
    }, 1000)
    return () => clearInterval(timer)
  }, []) // no need to add `value` to deps

  return <div>{value}</div>
}
```

## Type Declarations

```ts
export function useLatest<T>(value: T): React.MutableRefObject<T>
```

## Parameters

| Parameter | Type | Description        |
| --------- | ---- | ------------------ |
| `value`   | `T`  | The value to track |

## Returns

| Type                        | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `React.MutableRefObject<T>` | A ref whose `.current` is always the latest value |
