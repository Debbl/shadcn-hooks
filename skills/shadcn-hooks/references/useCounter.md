# useCounter

Counter with `inc`, `dec`, `set`, `reset` helpers.

## Usage

```tsx
import { useCounter } from 'shadcn-hooks'

function Component() {
  const [count, { inc, dec, set, reset }] = useCounter(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={inc}>+1</button>
      <button onClick={dec}>-1</button>
      <button onClick={() => set(100)}>Set to 100</button>
      <button onClick={() => set((v) => v * 2)}>Double</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

## Type Declarations

```ts
export function useCounter(initialValue?: number): readonly [
  number,
  {
    set: (value: number | ((value: number) => number)) => void
    inc: () => void
    dec: () => void
    reset: () => void
  },
]
```

## Parameters

| Parameter      | Type     | Default | Description           |
| -------------- | -------- | ------- | --------------------- |
| `initialValue` | `number` | `0`     | Initial counter value |

## Returns

A tuple `[count, actions]`:

| Property        | Type                                                 | Description                       |
| --------------- | ---------------------------------------------------- | --------------------------------- |
| `count`         | `number`                                             | Current count                     |
| `actions.set`   | `(value: number \| ((v: number) => number)) => void` | Set count directly or via updater |
| `actions.inc`   | `() => void`                                         | Increment by 1                    |
| `actions.dec`   | `() => void`                                         | Decrement by 1                    |
| `actions.reset` | `() => void`                                         | Reset to initial value            |
