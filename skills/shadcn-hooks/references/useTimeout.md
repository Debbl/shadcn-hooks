# useTimeout

Timeout timer with auto-cleanup. Returns a `clear` function to cancel the timeout manually.

## Usage

```tsx
import { useTimeout } from '@/hooks/use-timeout'

function Component() {
  const clear = useTimeout(() => {
    console.log('Executed after 3 seconds')
  }, 3000)

  return <button onClick={clear}>Cancel timeout</button>
}
```

## Type Declarations

```ts
export function useTimeout(fn: () => void, delay?: number): () => void
```

## Parameters

| Parameter | Type         | Default | Description                                       |
| --------- | ------------ | ------- | ------------------------------------------------- |
| `fn`      | `() => void` | —       | Callback to run after delay                       |
| `delay`   | `number`     | `0`     | Delay in ms. If negative, the timeout is not set. |

## Returns

| Type         | Description                     |
| ------------ | ------------------------------- |
| `() => void` | A function to clear the timeout |
