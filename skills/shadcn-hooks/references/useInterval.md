# useInterval

Interval timer with auto-cleanup. Returns a `clear` function to stop the interval manually.

## Usage

```tsx
import { useInterval } from '@/hooks/use-interval'

function Component() {
  const [count, setCount] = useState(0)

  const clear = useInterval(() => {
    setCount((c) => c + 1)
  }, 1000)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={clear}>Stop</button>
    </div>
  )
}
```

### Immediate execution

```tsx
useInterval(
  () => {
    fetchData()
  },
  5000,
  { immediate: true }, // runs immediately, then every 5s
)
```

## Type Declarations

```ts
export function useInterval(
  fn: () => void,
  delay?: number,
  options?: { immediate?: boolean },
): () => void
```

## Parameters

| Parameter           | Type         | Default | Description                                                        |
| ------------------- | ------------ | ------- | ------------------------------------------------------------------ |
| `fn`                | `() => void` | —       | Callback to run on each interval                                   |
| `delay`             | `number`     | —       | Interval in ms. If `undefined` or negative, the interval is paused |
| `options.immediate` | `boolean`    | `false` | Run `fn` immediately before the first interval                     |

## Returns

| Type         | Description                      |
| ------------ | -------------------------------- |
| `() => void` | A function to clear the interval |
