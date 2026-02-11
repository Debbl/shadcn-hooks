# useHash

Reactive `window.location.hash`. Automatically updates when the hash changes.

## Usage

```tsx
import { useHash } from 'shadcn-hooks'

function Component() {
  const hash = useHash()

  return <p>Current hash: {hash}</p>
}
```

## Type Declarations

```ts
export function useHash(): string
```

## Parameters

None.

## Returns

| Type     | Description                                                |
| -------- | ---------------------------------------------------------- |
| `string` | Current `window.location.hash` value (e.g. `"#section-1"`) |
