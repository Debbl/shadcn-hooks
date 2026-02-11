# useThrottleEffect

Throttled `useEffect`. The effect runs at most once per specified interval, even if dependencies change more frequently.

## Usage

```tsx
import { useThrottleEffect } from 'shadcn-hooks'

function Component() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useThrottleEffect(
    () => {
      trackPosition(position)
    },
    [position],
    200,
  )

  return (
    <div onMouseMove={(e) => setPosition({ x: e.clientX, y: e.clientY })} />
  )
}
```

## Type Declarations

```ts
import type { ThrottleOptions } from 'es-toolkit'

export function useThrottleEffect(
  effect: EffectCallback,
  deps: DependencyList,
  throttleMs?: number,
  options?: ThrottleOptions,
): void
```

## Parameters

| Parameter    | Type              | Default | Description               |
| ------------ | ----------------- | ------- | ------------------------- |
| `effect`     | `EffectCallback`  | —       | Effect function           |
| `deps`       | `DependencyList`  | —       | Dependencies to watch     |
| `throttleMs` | `number`          | `1000`  | Throttle interval in ms   |
| `options`    | `ThrottleOptions` | —       | Options from `es-toolkit` |
