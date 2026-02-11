# useFps

Reactive FPS (frames per second) measurement using `requestAnimationFrame`.

## Usage

```tsx
import { useFps } from 'shadcn-hooks'

function Component() {
  const fps = useFps()

  return <p>FPS: {fps}</p>
}
```

### Custom update frequency

```tsx
// Calculate FPS every 30 frames instead of the default 10
const fps = useFps({ every: 30 })
```

## Type Declarations

```ts
export interface UseFpsProps {
  /** Calculate FPS every x frames @default 10 */
  every?: number
}

export function useFps(options?: UseFpsProps): number
```

## Parameters

| Parameter       | Type     | Default | Description                    |
| --------------- | -------- | ------- | ------------------------------ |
| `options.every` | `number` | `10`    | Recalculate FPS every N frames |

## Returns

| Type     | Description       |
| -------- | ----------------- |
| `number` | Current FPS value |
