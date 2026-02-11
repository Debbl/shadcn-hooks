# useThrottleFn

Throttled function with `run`, `cancel`, `flush` controls. Automatically cancels on unmount.

## Usage

```tsx
import { useThrottleFn } from 'shadcn-hooks'

function Component() {
  const { run, cancel, flush } = useThrottleFn((value: string) => {
    console.log('Throttled:', value)
  }, 200)

  return <input onChange={(e) => run(e.target.value)} />
}
```

## Type Declarations

```ts
import type { ThrottleOptions } from 'es-toolkit'

export function useThrottleFn<Fn extends (...args: any[]) => any>(
  fn: Fn,
  throttleMs?: number,
  options?: ThrottleOptions,
): {
  run: (...args: Parameters<Fn>) => void
  cancel: () => void
  flush: () => void
}
```

## Parameters

| Parameter    | Type              | Default | Description               |
| ------------ | ----------------- | ------- | ------------------------- |
| `fn`         | `Fn`              | —       | The function to throttle  |
| `throttleMs` | `number`          | `1000`  | Throttle interval in ms   |
| `options`    | `ThrottleOptions` | —       | Options from `es-toolkit` |

## Returns

| Property | Type                | Description              |
| -------- | ------------------- | ------------------------ |
| `run`    | `(...args) => void` | The throttled function   |
| `cancel` | `() => void`        | Cancel pending execution |
| `flush`  | `() => void`        | Execute immediately      |
