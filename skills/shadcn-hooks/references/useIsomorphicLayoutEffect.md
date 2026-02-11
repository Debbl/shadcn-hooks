# useIsomorphicLayoutEffect

Uses `useLayoutEffect` on the client and `useEffect` on the server. Prevents SSR warnings about `useLayoutEffect` doing nothing on the server.

## Usage

```tsx
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect'

function Component() {
  useIsomorphicLayoutEffect(() => {
    // Safe to use in SSR — falls back to useEffect on the server
    document.title = 'Hello'
  }, [])

  return <div>...</div>
}
```

## Type Declarations

```ts
export const useIsomorphicLayoutEffect: typeof useLayoutEffect
```

## Parameters

Same as React's `useLayoutEffect` / `useEffect`.

| Parameter | Type             | Description               |
| --------- | ---------------- | ------------------------- |
| `effect`  | `EffectCallback` | Effect function           |
| `deps`    | `DependencyList` | Optional dependency array |
