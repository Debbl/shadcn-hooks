# useHover

Reactive hover state of an element with optional enter/leave/change callbacks.

## Usage

```tsx
import { useHover } from 'shadcn-hooks'

function Component() {
  const ref = useRef<HTMLDivElement>(null)
  const isHovered = useHover(ref)

  return (
    <div ref={ref} style={{ background: isHovered ? 'lightblue' : 'white' }}>
      {isHovered ? 'Hovered!' : 'Hover me'}
    </div>
  )
}
```

### With callbacks

```tsx
const isHovered = useHover(ref, {
  onEnter: () => console.log('Enter'),
  onLeave: () => console.log('Leave'),
  onChange: (hovering) => console.log('Hovering:', hovering),
})
```

## Type Declarations

```ts
export interface UseHoverOptions {
  onEnter?: () => void
  onLeave?: () => void
  onChange?: (isHovering: boolean) => void
}

export function useHover(
  target: BasicTarget,
  options?: UseHoverOptions,
): boolean
```

## Parameters

| Parameter          | Type                            | Description                  |
| ------------------ | ------------------------------- | ---------------------------- |
| `target`           | `BasicTarget`                   | Target element ref           |
| `options.onEnter`  | `() => void`                    | Called on mouse enter        |
| `options.onLeave`  | `() => void`                    | Called on mouse leave        |
| `options.onChange` | `(isHovering: boolean) => void` | Called on hover state change |

## Returns

| Type      | Description                              |
| --------- | ---------------------------------------- |
| `boolean` | Whether the element is currently hovered |
