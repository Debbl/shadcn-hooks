# useMount

Runs a callback only on component mount. Supports both synchronous and async callbacks.

## Usage

```tsx
import { useMount } from 'shadcn-hooks'

function Component() {
  useMount(() => {
    console.log('Component mounted')
    // Optional cleanup
    return () => console.log('Cleanup on unmount')
  })

  return <div>...</div>
}
```

### Async mount

```tsx
useMount(async () => {
  const data = await fetchData()
  console.log(data)
})
```

## Type Declarations

```ts
type MountCallback = EffectCallback | (() => Promise<void | (() => void)>)

export function useMount(fn: MountCallback): void
```

## Parameters

| Parameter | Type            | Description                                              |
| --------- | --------------- | -------------------------------------------------------- |
| `fn`      | `MountCallback` | Callback to run on mount. Can return a cleanup function. |
