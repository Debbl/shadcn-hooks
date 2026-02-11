# useClickAnyWhere

Listen to click events anywhere on the document.

## Usage

```tsx
import { useClickAnyWhere } from 'shadcn-hooks'

function Component() {
  useClickAnyWhere((event) => {
    console.log('Clicked at:', event.clientX, event.clientY)
  })

  return <div>Click anywhere on the page</div>
}
```

## Type Declarations

```ts
export function useClickAnyWhere(handler: (event: MouseEvent) => void): void
```

## Parameters

| Parameter | Type                          | Description         |
| --------- | ----------------------------- | ------------------- |
| `handler` | `(event: MouseEvent) => void` | Click event handler |
