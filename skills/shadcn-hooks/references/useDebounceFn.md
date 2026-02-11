# useDebounceFn

Debounced function with `run`, `cancel`, `flush` controls. Automatically cancels on unmount.

## Usage

```tsx
import { useDebounceFn } from 'shadcn-hooks'

function Component() {
  const { run, cancel, flush } = useDebounceFn((value: string) => {
    console.log('Search:', value)
  }, 500)

  return (
    <div>
      <input onChange={(e) => run(e.target.value)} />
      <button onClick={cancel}>Cancel</button>
      <button onClick={flush}>Flush now</button>
    </div>
  )
}
```

## Type Declarations

```ts
import type { DebounceOptions } from 'es-toolkit'

export function useDebounceFn<Fn extends (...args: any[]) => any>(
  fn: Fn,
  debounceMs?: number,
  options?: DebounceOptions,
): {
  run: (...args: Parameters<Fn>) => void
  cancel: () => void
  flush: () => void
}
```

## Parameters

| Parameter    | Type              | Default | Description               |
| ------------ | ----------------- | ------- | ------------------------- |
| `fn`         | `Fn`              | —       | The function to debounce  |
| `debounceMs` | `number`          | `1000`  | Debounce delay in ms      |
| `options`    | `DebounceOptions` | —       | Options from `es-toolkit` |

## Returns

| Property | Type                | Description              |
| -------- | ------------------- | ------------------------ |
| `run`    | `(...args) => void` | The debounced function   |
| `cancel` | `() => void`        | Cancel pending execution |
| `flush`  | `() => void`        | Execute immediately      |
