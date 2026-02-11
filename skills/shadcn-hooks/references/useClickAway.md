# useClickAway

Detect clicks outside of target element(s). Supports Shadow DOM and custom event types.

## Usage

```tsx
import { useClickAway } from 'shadcn-hooks'

function Dropdown() {
  const ref = useRef<HTMLDivElement>(null)

  useClickAway(() => {
    console.log('Clicked outside')
  }, ref)

  return <div ref={ref}>Dropdown content</div>
}
```

### Multiple targets

```tsx
const ref1 = useRef<HTMLDivElement>(null)
const ref2 = useRef<HTMLDivElement>(null)

useClickAway(() => close(), [ref1, ref2])
```

### Custom event

```tsx
useClickAway(() => close(), ref, 'mousedown')
```

## Type Declarations

```ts
export function useClickAway<T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName?: DocumentEventKey | DocumentEventKey[],
): void
```

## Parameters

| Parameter     | Type                                     | Default   | Description                    |
| ------------- | ---------------------------------------- | --------- | ------------------------------ |
| `onClickAway` | `(event: T) => void`                     | —         | Callback when clicking outside |
| `target`      | `BasicTarget \| BasicTarget[]`           | —         | Target element ref(s)          |
| `eventName`   | `DocumentEventKey \| DocumentEventKey[]` | `'click'` | Event type(s) to listen for    |
