# useMemoizedFn

Returns a stable function reference that never changes identity, while always calling the latest version of the function. Useful for passing callbacks to memoized child components.

## Usage

```tsx
import { useMemoizedFn } from '@/hooks/use-memoized-fn'

function Component({ onClick }: { onClick: (id: string) => void }) {
  // `memoizedOnClick` has a stable identity across re-renders
  const memoizedOnClick = useMemoizedFn(onClick)

  return <ExpensiveChild onClick={memoizedOnClick} />
}
```

## Type Declarations

```ts
export function useMemoizedFn<T extends (...args: any[]) => any>(fn: T): T
```

## Parameters

| Parameter | Type | Description             |
| --------- | ---- | ----------------------- |
| `fn`      | `T`  | The function to memoize |

## Returns

| Type | Description                                                         |
| ---- | ------------------------------------------------------------------- |
| `T`  | A stable-identity function that always delegates to the latest `fn` |
