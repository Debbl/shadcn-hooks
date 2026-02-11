# useDeepCompareEffect

`useEffect` with deep dependency comparison using `dequal`. Use when dependencies are objects or arrays that may have the same values but different references.

## Usage

```tsx
import { useDeepCompareEffect } from '@/hooks/use-deep-compare-effect'

function Component({ filters }: { filters: { status: string; page: number } }) {
  useDeepCompareEffect(() => {
    // Only runs when filters deeply change
    fetchData(filters)
  }, [filters])

  return <div>...</div>
}
```

## Type Declarations

```ts
export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList,
): void
```

## Parameters

| Parameter | Type             | Description                               |
| --------- | ---------------- | ----------------------------------------- |
| `effect`  | `EffectCallback` | Effect function                           |
| `deps`    | `DependencyList` | Dependencies (compared via deep equality) |
