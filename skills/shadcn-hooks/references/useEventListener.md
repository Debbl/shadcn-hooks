# useEventListener

Declarative event listener with auto-cleanup. Supports type-safe event maps for `HTMLElement`, `Element`, `Window`, and `Document`.

## Usage

```tsx
import { useEventListener } from 'shadcn-hooks'

function Component() {
  // Listen on window (default)
  useEventListener('resize', () => {
    console.log('Window resized')
  })

  return <div>...</div>
}
```

### Target element

```tsx
const ref = useRef<HTMLDivElement>(null)

useEventListener(
  'click',
  (e) => {
    console.log('Clicked:', e.target)
  },
  { target: ref },
)
```

### Multiple events

```tsx
useEventListener(
  ['mouseenter', 'mouseleave'],
  (e) => {
    console.log(e.type)
  },
  { target: ref },
)
```

### Enable/disable

```tsx
useEventListener('scroll', handleScroll, {
  enable: isEnabled,
  passive: true,
})
```

## Type Declarations

```ts
export type Target = BasicTarget<HTMLElement | Element | Window | Document>

interface Options<T extends Target = Target> {
  target?: T
  capture?: boolean
  once?: boolean
  passive?: boolean
  enable?: boolean
}

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>,
): void

export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>,
): void

export function useEventListener(
  eventName: string | string[],
  handler: (event: Event) => void,
  options?: Options,
): void
```

## Parameters

| Parameter         | Type                     | Default  | Description                 |
| ----------------- | ------------------------ | -------- | --------------------------- |
| `eventName`       | `string \| string[]`     | —        | Event name(s)               |
| `handler`         | `(event: Event) => void` | —        | Event handler               |
| `options.target`  | `Target`                 | `window` | Target element              |
| `options.capture` | `boolean`                | —        | Use capture phase           |
| `options.once`    | `boolean`                | —        | Remove after first trigger  |
| `options.passive` | `boolean`                | —        | Passive listener            |
| `options.enable`  | `boolean`                | `true`   | Enable/disable the listener |
