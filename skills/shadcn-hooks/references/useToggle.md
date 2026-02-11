# useToggle

Toggle between two values with utility actions. Defaults to toggling between `true` and `false`.

## Usage

### Boolean toggle

```tsx
import { useToggle } from '@/hooks/use-toggle'

function Component() {
  const [state, { toggle, set, setLeft, setRight }] = useToggle()

  return (
    <div>
      <p>State: {state.toString()}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  )
}
```

### Custom values

```tsx
function Component() {
  const [mode, { toggle, setLeft, setRight }] = useToggle('light', 'dark')

  return (
    <div>
      <p>Mode: {mode}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setLeft}>Light</button>
      <button onClick={setRight}>Dark</button>
    </div>
  )
}
```

## Type Declarations

```ts
export interface Actions<T> {
  setLeft: () => void
  setRight: () => void
  set: (value: T) => void
  toggle: () => void
}

export function useToggle<T = boolean>(): [boolean, Actions<T>]
export function useToggle<T>(defaultValue: T): [T, Actions<T>]
export function useToggle<T, U>(
  defaultValue: T,
  reverseValue: U,
): [T | U, Actions<T | U>]
```

## Parameters

| Parameter      | Type | Default         | Description               |
| -------------- | ---- | --------------- | ------------------------- |
| `defaultValue` | `T`  | `false`         | The default (left) value  |
| `reverseValue` | `U`  | `!defaultValue` | The reverse (right) value |

## Returns

A tuple `[state, actions]`:

| Property           | Type                      | Description                   |
| ------------------ | ------------------------- | ----------------------------- |
| `state`            | `T \| U`                  | Current value                 |
| `actions.toggle`   | `() => void`              | Switch between the two values |
| `actions.set`      | `(value: T \| U) => void` | Set value directly            |
| `actions.setLeft`  | `() => void`              | Set to the default value      |
| `actions.setRight` | `() => void`              | Set to the reverse value      |
