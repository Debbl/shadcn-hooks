# useCustomCompareEffect

`useEffect` with a custom dependency comparator. Useful when you need specialized comparison logic beyond reference or deep equality.

## Usage

```tsx
import { useCustomCompareEffect } from '@/hooks/use-custom-compare-effect'

function Component({ data }: { data: number[] }) {
  useCustomCompareEffect(
    () => {
      console.log('Data changed:', data)
    },
    [data],
    (prev, next) => {
      // Only trigger when array length changes
      return prev[0]?.length === next[0]?.length
    },
  )

  return <div>{data.join(', ')}</div>
}
```

## Type Declarations

```ts
export function useCustomCompareEffect<T extends DependencyList>(
  effect: EffectCallback,
  deps: T,
  customCompare: (a: T, b: T) => boolean,
): void
```

## Parameters

| Parameter       | Type                       | Description                               |
| --------------- | -------------------------- | ----------------------------------------- |
| `effect`        | `EffectCallback`           | The effect function                       |
| `deps`          | `T extends DependencyList` | Dependencies                              |
| `customCompare` | `(a: T, b: T) => boolean`  | Custom comparator; return `true` if equal |
