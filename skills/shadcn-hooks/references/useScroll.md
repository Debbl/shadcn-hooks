# useScroll

Track scroll position, direction, boundary arrival state, and scrolling activity.

## Usage

```tsx
import { useRef } from 'react'
import { useScroll } from '@/hooks/use-scroll'

function ScrollPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const { x, y, isScrolling, directions, arrivedState } = useScroll(ref, {
    idle: 300,
  })

  return (
    <div>
      <div ref={ref} style={{ height: 240, overflow: 'auto' }}>
        {/* content */}
      </div>
      <p>
        x: {x}, y: {y}, scrolling: {String(isScrolling)}
      </p>
      <p>
        down: {String(directions.down)}, bottom: {String(arrivedState.bottom)}
      </p>
    </div>
  )
}
```

### Track window scroll

```tsx
const { y, directions } = useScroll()
```

## Type Declarations

```ts
export type UseScrollTarget = BasicTarget<HTMLElement | Window>

export interface UseScrollOffset {
  left?: number
  right?: number
  top?: number
  bottom?: number
}

export interface UseScrollDirections {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
}

export interface UseScrollArrivedState {
  left: boolean
  right: boolean
  top: boolean
  bottom: boolean
}

export interface UseScrollOptions {
  throttle?: number
  idle?: number
  offset?: UseScrollOffset
  onScroll?: (e: Event) => void
  onStop?: (e: Event) => void
}

export interface UseScrollReturn {
  x: number
  y: number
  isScrolling: boolean
  directions: UseScrollDirections
  arrivedState: UseScrollArrivedState
  measure: () => void
}

export function useScroll(
  target?: UseScrollTarget,
  options?: UseScrollOptions,
): UseScrollReturn
```

## Parameters

| Parameter          | Type                 | Default  | Description                               |
| ------------------ | -------------------- | -------- | ----------------------------------------- |
| `target`           | `UseScrollTarget`    | `window` | Target element or window to observe       |
| `options.throttle` | `number`             | `0`      | Throttle interval in milliseconds         |
| `options.idle`     | `number`             | `200`    | Idle duration before scrolling stops      |
| `options.offset`   | `UseScrollOffset`    | `{}`     | Boundary offsets for arrival detection    |
| `options.onScroll` | `(e: Event) => void` | `-`      | Callback fired on each scroll event       |
| `options.onStop`   | `(e: Event) => void` | `-`      | Callback fired when scrolling has stopped |

## Returns

| Property       | Type                    | Description                                          |
| -------------- | ----------------------- | ---------------------------------------------------- |
| `x`            | `number`                | Current horizontal scroll position                   |
| `y`            | `number`                | Current vertical scroll position                     |
| `isScrolling`  | `boolean`               | Whether the target is currently scrolling            |
| `directions`   | `UseScrollDirections`   | Direction flags comparing current and previous frame |
| `arrivedState` | `UseScrollArrivedState` | Whether each boundary has been reached               |
| `measure`      | `() => void`            | Manually re-measure and update all scroll state      |
