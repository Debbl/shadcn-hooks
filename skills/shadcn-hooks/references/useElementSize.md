# useElementSize

Reactive element width and height tracking based on `ResizeObserver`.

## Usage

```tsx
import { useElementSize } from '@/hooks/use-element-size'

function Component() {
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useElementSize(ref)

  return (
    <div ref={ref}>
      {Math.round(width)} x {Math.round(height)}
    </div>
  )
}
```

### With options

```tsx
const size = useElementSize(
  ref,
  { width: 100, height: 40 },
  { box: 'border-box' },
)
```

## Type Declarations

```ts
export interface ElementSize {
  width: number
  height: number
}

export interface UseElementSizeOptions {
  box?: ResizeObserverBoxOptions
}

export function useElementSize(
  target: BasicTarget<Element>,
  initialSize?: ElementSize,
  options?: UseElementSizeOptions,
): ElementSize
```

## Parameters

| Parameter     | Type                       | Default         | Description                        |
| ------------- | -------------------------- | --------------- | ---------------------------------- |
| `target`      | `BasicTarget<Element>`     | -               | Target element to observe          |
| `initialSize` | `ElementSize`              | `{0, 0}`        | Initial width and height values    |
| `options.box` | `ResizeObserverBoxOptions` | `'content-box'` | Box model used by `ResizeObserver` |

## Returns

| Type          | Description              |
| ------------- | ------------------------ |
| `ElementSize` | Current width and height |
