# usePrevious

Returns the previous value of a state. Supports a custom comparator to decide when to record a new "previous" value.

## Usage

```tsx
import { usePrevious } from '@/hooks/use-previous'

function Component() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {previousCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

### With custom comparator

```tsx
const previousValue = usePrevious(value, (prev, next) => {
  // Only record changes greater than 5
  return Math.abs((next ?? 0) - (prev ?? 0)) > 5
})
```

## Type Declarations

```ts
export type ShouldUpdateFunc<T> = (prev?: T, next?: T) => boolean

export function usePrevious<T>(
  state: T,
  shouldUpdate?: ShouldUpdateFunc<T>,
): T | undefined
```

## Parameters

| Parameter      | Type                  | Default            | Description                |
| -------------- | --------------------- | ------------------ | -------------------------- |
| `state`        | `T`                   | —                  | The current value to track |
| `shouldUpdate` | `ShouldUpdateFunc<T>` | `!Object.is(a, b)` | Custom comparator          |

## Returns

| Type             | Description                                        |
| ---------------- | -------------------------------------------------- |
| `T \| undefined` | The previous value, or `undefined` on first render |
