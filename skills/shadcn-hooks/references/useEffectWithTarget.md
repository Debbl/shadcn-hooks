# useEffectWithTarget

`useEffect` that supports target DOM element(s) as dependencies. The effect re-runs when the target element changes (e.g. when a ref is assigned). Used internally by many browser hooks.

## Usage

```tsx
import { useEffectWithTarget } from '@/hooks/use-effect-with-target'

function Component() {
  const ref = useRef<HTMLDivElement>(null)

  useEffectWithTarget(
    () => {
      const el = ref.current
      if (!el) return
      // Set up effect on the element
      el.style.color = 'red'
    },
    [], // deps
    ref, // target
  )

  return <div ref={ref}>Hello</div>
}
```

## Type Declarations

```ts
export function useEffectWithTarget(
  effect: EffectCallback,
  deps: DependencyList,
  target: BasicTarget | BasicTarget[],
): void
```

## Parameters

| Parameter | Type                           | Description                        |
| --------- | ------------------------------ | ---------------------------------- |
| `effect`  | `EffectCallback`               | Effect function                    |
| `deps`    | `DependencyList`               | Additional dependencies            |
| `target`  | `BasicTarget \| BasicTarget[]` | Target element ref(s) or getter(s) |
