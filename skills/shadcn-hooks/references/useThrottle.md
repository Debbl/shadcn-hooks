# useThrottle

Returns a throttled version of a value. The throttled value updates at most once per specified interval.

## Usage

```tsx
import { useThrottle } from '@/hooks/use-throttle'

function Component() {
  const [value, setValue] = useState('')
  const throttledValue = useThrottle(value, 500)

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Throttled: {throttledValue}</p>
    </div>
  )
}
```

## Type Declarations

```ts
import type { ThrottleOptions } from 'es-toolkit'

export function useThrottle<T>(
  value: T,
  throttleMs?: number,
  options?: ThrottleOptions,
): T
```

## Parameters

| Parameter    | Type              | Default | Description                                  |
| ------------ | ----------------- | ------- | -------------------------------------------- |
| `value`      | `T`               | —       | The value to throttle                        |
| `throttleMs` | `number`          | `1000`  | Throttle interval in milliseconds            |
| `options`    | `ThrottleOptions` | —       | Options from `es-toolkit` (e.g. `{ edges }`) |

## Returns

| Type | Description         |
| ---- | ------------------- |
| `T`  | The throttled value |
