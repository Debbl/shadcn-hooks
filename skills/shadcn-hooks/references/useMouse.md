# useMouse

Track pointer coordinates with optional touch support.

## Usage

```tsx
import { useMouse } from '@/hooks/use-mouse'

function Component() {
  const mouse = useMouse()

  return (
    <p>
      X: {mouse.x}, Y: {mouse.y}, Source: {mouse.sourceType ?? 'none'}
    </p>
  )
}
```

### Configure coordinate type and touch behavior

```tsx
const mouse = useMouse({
  type: 'client',
  touch: true,
  resetOnTouchEnds: false,
  initialValue: { x: 0, y: 0 },
})
```

## Type Declarations

```ts
export type UseMouseCoordType = 'page' | 'client' | 'screen' | 'movement'
export type UseMouseSourceType = 'mouse' | 'touch' | null

export interface UseMouseInitialValue {
  x: number
  y: number
}

export interface UseMouseState extends UseMouseInitialValue {
  sourceType: UseMouseSourceType
}

export interface UseMouseOptions {
  type?: UseMouseCoordType
  touch?: boolean
  resetOnTouchEnds?: boolean
  initialValue?: UseMouseInitialValue
  window?: Window
}

export function useMouse(options?: UseMouseOptions): UseMouseState
```

## Parameters

| Parameter                  | Type                   | Default          | Description                                         |
| -------------------------- | ---------------------- | ---------------- | --------------------------------------------------- |
| `options.type`             | `UseMouseCoordType`    | `'page'`         | Coordinate space used for `x` and `y`               |
| `options.touch`            | `boolean`              | `true`           | Whether touch events update coordinates             |
| `options.resetOnTouchEnds` | `boolean`              | `false`          | Reset to `initialValue` when touch ends             |
| `options.initialValue`     | `UseMouseInitialValue` | `{ x: 0, y: 0 }` | Initial coordinate values                           |
| `options.window`           | `Window`               | global `window`  | Custom window object used to attach event listeners |

## Returns

| Property     | Type                 | Description                                      |
| ------------ | -------------------- | ------------------------------------------------ |
| `x`          | `number`             | Current horizontal coordinate                    |
| `y`          | `number`             | Current vertical coordinate                      |
| `sourceType` | `UseMouseSourceType` | Last event source (`'mouse'`, `'touch'`, `null`) |
