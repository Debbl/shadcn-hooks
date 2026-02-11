# useLockFn

Prevents concurrent execution of an async function. While the function is running, subsequent calls are ignored until the current execution completes.

## Usage

```tsx
import { useLockFn } from 'shadcn-hooks'

function Component() {
  const submit = useLockFn(async () => {
    await saveData()
    // Rapid clicks won't trigger duplicate saves
  })

  return <button onClick={submit}>Save</button>
}
```

## Type Declarations

```ts
export function useLockFn<P extends unknown[], V>(
  fn: (...args: P) => Promise<V>,
): (...args: P) => Promise<V | undefined>
```

## Parameters

| Parameter | Type                         | Description                |
| --------- | ---------------------------- | -------------------------- |
| `fn`      | `(...args: P) => Promise<V>` | The async function to lock |

## Returns

| Type                                      | Description                                    |
| ----------------------------------------- | ---------------------------------------------- |
| `(...args: P) => Promise<V \| undefined>` | A locked version that ignores calls while busy |
