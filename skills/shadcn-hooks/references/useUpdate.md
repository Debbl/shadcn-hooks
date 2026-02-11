# useUpdate

Returns a function that forces a component re-render.

## Usage

```tsx
import { useUpdate } from 'shadcn-hooks'

function Component() {
  const update = useUpdate()

  return (
    <div>
      <p>Time: {Date.now()}</p>
      <button onClick={update}>Force re-render</button>
    </div>
  )
}
```

## Type Declarations

```ts
export function useUpdate(): () => void
```

## Parameters

None.

## Returns

| Type         | Description                                             |
| ------------ | ------------------------------------------------------- |
| `() => void` | A stable function that triggers a re-render when called |
