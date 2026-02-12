# useActiveElement

Track the currently focused element in the document.

## Usage

```tsx
import { useActiveElement } from '@/hooks/use-active-element'

function Component() {
  const activeElement = useActiveElement()

  return (
    <p>
      Active: {activeElement ? activeElement.tagName.toLowerCase() : 'none'}
    </p>
  )
}
```

## Type Declarations

```ts
export interface UseActiveElementOptions {
  deep?: boolean
  triggerOnRemoval?: boolean
}

export function useActiveElement<T extends Element = HTMLElement>(
  options?: UseActiveElementOptions,
): T | null
```

## Parameters

| Parameter                  | Type    | Default | Description                                           |
| -------------------------- | ------- | ------- | ----------------------------------------------------- |
| `options.deep`             | boolean | `true`  | Resolve the deepest focused node inside shadow roots. |
| `options.triggerOnRemoval` | boolean | `false` | Re-check focus when DOM nodes are removed.            |

## Returns

| Type        | Description                              |
| ----------- | ---------------------------------------- |
| `T \| null` | The currently focused element or `null`. |
