# useEffectEvent

Ponyfill for React 19's `useEffectEvent`. Returns a stable function reference that always calls the latest version of the callback, but throws if called during render.

## Usage

```tsx
import { useEffectEvent } from '@/hooks/use-effect-event'

function Component({
  url,
  onVisit,
}: {
  url: string
  onVisit: (url: string) => void
}) {
  const onVisitStable = useEffectEvent(onVisit)

  useEffect(() => {
    onVisitStable(url)
    // No need to add `onVisit` to deps
  }, [url])

  return <div>{url}</div>
}
```

## Type Declarations

```ts
export function useEffectEvent<T extends (...args: any[]) => void>(fn: T): T
```

## Parameters

| Parameter | Type | Description                |
| --------- | ---- | -------------------------- |
| `fn`      | `T`  | The event handler function |

## Returns

| Type | Description                                                                                   |
| ---- | --------------------------------------------------------------------------------------------- |
| `T`  | A stable-identity function that delegates to the latest `fn`. Throws if called during render. |
