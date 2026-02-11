# useResetState

State hook that provides a `reset` function to restore the initial value.

## Usage

```tsx
import { useResetState } from '@/hooks/use-reset-state'

function Component() {
  const [form, setForm, resetForm] = useResetState({
    name: '',
    email: '',
  })

  return (
    <form>
      <input
        value={form.name}
        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
      />
      <input
        value={form.email}
        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
      />
      <button type='button' onClick={resetForm}>
        Reset
      </button>
    </form>
  )
}
```

## Type Declarations

```ts
export function useResetState<S>(
  initialState: S | (() => S),
): readonly [S, Dispatch<SetStateAction<S>>, () => void]
```

## Parameters

| Parameter      | Type             | Description                    |
| -------------- | ---------------- | ------------------------------ |
| `initialState` | `S \| (() => S)` | Initial state value or factory |

## Returns

A tuple `[state, setState, resetState]`:

| Property     | Type                          | Description            |
| ------------ | ----------------------------- | ---------------------- |
| `state`      | `S`                           | Current state          |
| `setState`   | `Dispatch<SetStateAction<S>>` | Standard state setter  |
| `resetState` | `() => void`                  | Reset to initial value |
