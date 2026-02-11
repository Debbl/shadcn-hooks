# useDeepCompareLayoutEffect

`useLayoutEffect` with deep dependency comparison using `dequal`. Fires synchronously after all DOM mutations, but only when dependencies deeply change.

## Usage

```tsx
import { useDeepCompareLayoutEffect } from 'shadcn-hooks'

function Component({ style }: { style: React.CSSProperties }) {
  useDeepCompareLayoutEffect(() => {
    // Synchronously apply when style deeply changes
    applyStyle(style)
  }, [style])

  return <div>...</div>
}
```

## Type Declarations

```ts
export function useDeepCompareLayoutEffect(
  effect: EffectCallback,
  deps: DependencyList,
): void
```

## Parameters

| Parameter | Type             | Description                               |
| --------- | ---------------- | ----------------------------------------- |
| `effect`  | `EffectCallback` | Effect function                           |
| `deps`    | `DependencyList` | Dependencies (compared via deep equality) |
