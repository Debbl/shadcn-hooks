# useIsHydrated

Returns `true` after client hydration completes. During SSR it always returns `false`. After hydration on the client, it returns `true` on every subsequent render.

## Usage

```tsx
import { useIsHydrated } from '@/hooks/use-is-hydrated'

function Component() {
  const isHydrated = useIsHydrated()

  return (
    <button type='button' disabled={!isHydrated} onClick={doSomething}>
      Click me
    </button>
  )
}
```

## Type Declarations

```ts
export function useIsHydrated(): boolean
```

## Parameters

None.

## Returns

| Type      | Description                                               |
| --------- | --------------------------------------------------------- |
| `boolean` | `false` during SSR / first render, `true` after hydration |
