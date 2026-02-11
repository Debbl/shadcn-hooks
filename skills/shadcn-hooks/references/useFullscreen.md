# useFullscreen

Reactive Fullscreen API with cross-browser support (including webkit/moz/ms prefixes).

## Usage

```tsx
import { useFullscreen } from 'shadcn-hooks'

function Component() {
  const ref = useRef<HTMLDivElement>(null)
  const { isFullscreen, isSupported, enter, exit, toggle } = useFullscreen(ref)

  return (
    <div ref={ref}>
      <p>Fullscreen: {isFullscreen.toString()}</p>
      <button onClick={toggle} disabled={!isSupported}>
        Toggle Fullscreen
      </button>
    </div>
  )
}
```

### Document fullscreen

```tsx
// No target — uses document.documentElement
const { toggle } = useFullscreen()
```

### Auto exit on unmount

```tsx
const { enter } = useFullscreen(ref, { autoExit: true })
```

## Type Declarations

```ts
export interface UseFullscreenOptions {
  /** Automatically exit fullscreen on unmount @default false */
  autoExit?: boolean
}

export function useFullscreen(
  target?: BasicTarget<HTMLElement | Element>,
  options?: UseFullscreenOptions,
): {
  isSupported: boolean
  isFullscreen: boolean
  enter: () => Promise<void>
  exit: () => Promise<void>
  toggle: () => Promise<void>
}
```

## Parameters

| Parameter          | Type          | Default                    | Description                |
| ------------------ | ------------- | -------------------------- | -------------------------- |
| `target`           | `BasicTarget` | `document.documentElement` | Target element             |
| `options.autoExit` | `boolean`     | `false`                    | Exit fullscreen on unmount |

## Returns

| Property       | Type                  | Description                         |
| -------------- | --------------------- | ----------------------------------- |
| `isSupported`  | `boolean`             | Whether Fullscreen API is available |
| `isFullscreen` | `boolean`             | Current fullscreen state            |
| `enter`        | `() => Promise<void>` | Enter fullscreen                    |
| `exit`         | `() => Promise<void>` | Exit fullscreen                     |
| `toggle`       | `() => Promise<void>` | Toggle fullscreen                   |
