# useInViewport

Track element visibility via IntersectionObserver. Returns whether the element is in the viewport and its intersection ratio.

## Usage

```tsx
import { useInViewport } from '@/hooks/use-in-viewport'

function Component() {
  const ref = useRef<HTMLDivElement>(null)
  const [isInViewport, ratio] = useInViewport(ref)

  return (
    <div ref={ref}>
      {isInViewport ? 'Visible' : 'Not visible'} (ratio: {ratio})
    </div>
  )
}
```

### With options

```tsx
const [isInViewport] = useInViewport(ref, {
  threshold: 0.5,
  rootMargin: '100px',
  callback: (entry) => {
    console.log('Intersection:', entry.intersectionRatio)
  },
})
```

### Multiple targets

```tsx
const ref1 = useRef<HTMLDivElement>(null)
const ref2 = useRef<HTMLDivElement>(null)

const [isInViewport] = useInViewport([ref1, ref2])
```

## Type Declarations

```ts
export interface UseInViewportOptions {
  rootMargin?: string
  threshold?: number | number[]
  root?: BasicTarget<Element>
  callback?: (entry: IntersectionObserverEntry) => void
}

export function useInViewport(
  target: BasicTarget | BasicTarget[],
  options?: UseInViewportOptions,
): readonly [boolean | undefined, number | undefined]
```

## Parameters

| Parameter            | Type                           | Description                     |
| -------------------- | ------------------------------ | ------------------------------- |
| `target`             | `BasicTarget \| BasicTarget[]` | Target element(s)               |
| `options.rootMargin` | `string`                       | Root margin                     |
| `options.threshold`  | `number \| number[]`           | Intersection threshold(s)       |
| `options.root`       | `BasicTarget<Element>`         | Root element                    |
| `options.callback`   | `(entry) => void`              | Callback on intersection change |

## Returns

A tuple `[isInViewport, ratio]`:

| Property       | Type                   | Description               |
| -------------- | ---------------------- | ------------------------- |
| `isInViewport` | `boolean \| undefined` | Whether target is visible |
| `ratio`        | `number \| undefined`  | Intersection ratio (0–1)  |
