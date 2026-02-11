# useTextSelection

Reactive text selection state with bounding rect. Returns the selected text and its position on the page.

## Usage

```tsx
import { useTextSelection } from '@/hooks/use-text-selection'

function Component() {
  const { text, left, top, width, height } = useTextSelection()

  return (
    <div>
      <p>Select some text in this paragraph to see the selection state.</p>
      {text && (
        <div
          style={{
            position: 'fixed',
            left,
            top: (top ?? 0) - 30,
            background: 'black',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 4,
          }}
        >
          Selected: {text}
        </div>
      )}
    </div>
  )
}
```

### Scoped to element

```tsx
const ref = useRef<HTMLDivElement>(null)
const { text } = useTextSelection(ref)
```

## Type Declarations

```ts
export interface State {
  text: string
  top: number
  left: number
  bottom: number
  right: number
  height: number
  width: number
}

export function useTextSelection(
  target?: BasicTarget<Document | Element>,
): State
```

## Parameters

| Parameter | Type                               | Default    | Description                     |
| --------- | ---------------------------------- | ---------- | ------------------------------- |
| `target`  | `BasicTarget<Document \| Element>` | `document` | Scope selection to this element |

## Returns

| Property | Type     | Description                     |
| -------- | -------- | ------------------------------- |
| `text`   | `string` | Selected text                   |
| `top`    | `number` | Top position of selection rect  |
| `left`   | `number` | Left position of selection rect |
| `bottom` | `number` | Bottom position                 |
| `right`  | `number` | Right position                  |
| `height` | `number` | Height of selection rect        |
| `width`  | `number` | Width of selection rect         |
