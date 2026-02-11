# useBoolean

Boolean state with `set`, `setTrue`, `setFalse`, `toggle` helpers.

## Usage

```tsx
import { useBoolean } from '@/hooks/use-boolean'

function Component() {
  const [value, { set, setTrue, setFalse, toggle }] = useBoolean(false)

  return (
    <div>
      <p>Value: {value.toString()}</p>
      <button onClick={setTrue}>Set True</button>
      <button onClick={setFalse}>Set False</button>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => set(true)}>Set to true</button>
    </div>
  )
}
```

## Type Declarations

```ts
export function useBoolean(defaultValue?: boolean): readonly [
  boolean,
  {
    /** Set the value of the boolean */
    set: (value: boolean) => void
    /** Set the value to true */
    setTrue: () => void
    /** Set the value to false */
    setFalse: () => void
    /** Toggle the value */
    toggle: () => void
  },
]
```

## Parameters

| Parameter      | Type      | Default | Description           |
| -------------- | --------- | ------- | --------------------- |
| `defaultValue` | `boolean` | `false` | Initial boolean value |

## Returns

A tuple `[state, actions]`:

| Property           | Type                       | Description           |
| ------------------ | -------------------------- | --------------------- |
| `state`            | `boolean`                  | Current boolean value |
| `actions.set`      | `(value: boolean) => void` | Set value directly    |
| `actions.setTrue`  | `() => void`               | Set to `true`         |
| `actions.setFalse` | `() => void`               | Set to `false`        |
| `actions.toggle`   | `() => void`               | Toggle the value      |
