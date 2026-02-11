# useCreation

Memoized factory with deep dependency comparison. Similar to `useMemo`, but uses deep equality (`isEqual` from `es-toolkit`) to compare dependencies, ensuring the factory is only re-invoked when dependencies truly change.

## Usage

```tsx
import { useCreation } from '@/hooks/use-creation'

function Component({ config }: { config: { threshold: number } }) {
  // Re-creates only when config deeply changes, not on every render
  const processor = useCreation(() => new DataProcessor(config), [config])

  return <div>{processor.result}</div>
}
```

## Type Declarations

```ts
export function useCreation<T>(factory: () => T, deps: DependencyList): T
```

## Parameters

| Parameter | Type             | Description                               |
| --------- | ---------------- | ----------------------------------------- |
| `factory` | `() => T`        | Factory function to create the value      |
| `deps`    | `DependencyList` | Dependencies (compared via deep equality) |

## Returns

| Type | Description        |
| ---- | ------------------ |
| `T`  | The memoized value |
