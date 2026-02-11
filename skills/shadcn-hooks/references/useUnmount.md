# useUnmount

Runs a cleanup function when the component unmounts. Always calls the latest version of the callback.

## Usage

```tsx
import { useUnmount } from 'shadcn-hooks'

function Component() {
  useUnmount(() => {
    console.log('Component unmounted')
    cleanup()
  })

  return <div>...</div>
}
```

## Type Declarations

```ts
export function useUnmount(fn: () => void): void
```

## Parameters

| Parameter | Type         | Description                        |
| --------- | ------------ | ---------------------------------- |
| `fn`      | `() => void` | Cleanup function to run on unmount |
