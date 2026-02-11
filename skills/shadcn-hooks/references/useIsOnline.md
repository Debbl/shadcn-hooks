# useIsOnline

Reactive online/offline network status. Returns `true` on the server for SSR safety.

## Usage

```tsx
import { useIsOnline } from 'shadcn-hooks'

function Component() {
  const isOnline = useIsOnline()

  return <div>{isOnline ? 'Online' : 'Offline'}</div>
}
```

## Type Declarations

```ts
export function useIsOnline(): boolean
```

## Parameters

None.

## Returns

| Type      | Description                   |
| --------- | ----------------------------- |
| `boolean` | Whether the browser is online |
