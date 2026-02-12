# useDocumentVisibility

Reactive `document.visibilityState` for browser tab visibility tracking. Returns `visible` on the server for SSR safety.

## Usage

```tsx
import { useDocumentVisibility } from '@/hooks/use-document-visibility'

function Component() {
  const visibilityState = useDocumentVisibility()

  return <div>Visibility: {visibilityState}</div>
}
```

## Type Declarations

```ts
export function useDocumentVisibility(): DocumentVisibilityState
```

## Parameters

None.

## Returns

| Type                      | Description                                |
| ------------------------- | ------------------------------------------ |
| `DocumentVisibilityState` | Current visibility state of the `document` |
