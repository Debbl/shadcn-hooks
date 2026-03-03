# useDefault

State hook that returns a fallback value when state is `null` or `undefined`.

## Usage

```tsx
import { useDefault } from '@/hooks/use-default'

function Component() {
  const [name, setName] = useDefault<string>(undefined, 'Guest')

  return (
    <div>
      <p>{name}</p>
      <button onClick={() => setName('Alice')}>Set name</button>
      <button onClick={() => setName(undefined)}>Reset to default</button>
    </div>
  )
}
```

## Type Declarations

```ts
export type UseDefaultState<T> = T | null | undefined

export function useDefault<T>(
  initialValue: UseDefaultState<T>,
  defaultValue: T,
): readonly [T, Dispatch<SetStateAction<UseDefaultState<T>>>]
```

## Parameters

| Parameter      | Type                     | Description                                     |
| -------------- | ------------------------ | ----------------------------------------------- |
| `initialValue` | `T \| null \| undefined` | Initial state value                             |
| `defaultValue` | `T`                      | Fallback value when state is `null`/`undefined` |

## Returns

A tuple `[value, setState]`:

| Property   | Type                                               | Description                         |
| ---------- | -------------------------------------------------- | ----------------------------------- |
| `value`    | `T`                                                | Current state value or the fallback |
| `setState` | `Dispatch<SetStateAction<T \| null \| undefined>>` | Standard state setter               |
