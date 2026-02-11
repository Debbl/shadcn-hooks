# useUpdateEffect

`useEffect` that skips the first render. Only fires on subsequent dependency changes.

## Usage

```tsx
import { useUpdateEffect } from '@/hooks/use-update-effect'

function Component({ value }: { value: string }) {
  useUpdateEffect(() => {
    // Won't run on mount, only when `value` changes afterwards
    console.log('Value updated:', value)
  }, [value])

  return <div>{value}</div>
}
```

## Type Declarations

```ts
export function useUpdateEffect(
  effect: EffectCallback,
  deps: DependencyList,
): void
```

## Parameters

| Parameter | Type             | Description                               |
| --------- | ---------------- | ----------------------------------------- |
| `effect`  | `EffectCallback` | Effect function (skipped on first render) |
| `deps`    | `DependencyList` | Dependencies to watch                     |
