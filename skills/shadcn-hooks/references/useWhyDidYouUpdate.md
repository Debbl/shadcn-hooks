# useWhyDidYouUpdate

Logs which props changed between renders to the console. Useful for debugging unnecessary re-renders during development.

## Usage

```tsx
import { useWhyDidYouUpdate } from 'shadcn-hooks'

function Component(props: { name: string; count: number }) {
  useWhyDidYouUpdate('Component', props)

  return (
    <div>
      {props.name}: {props.count}
    </div>
  )
}

// Console output when props change:
// [why-did-you-update] Component { count: { from: 1, to: 2 } }
```

## Type Declarations

```ts
export type IProps = Record<string, unknown>

export function useWhyDidYouUpdate(componentName: string, props: IProps): void
```

## Parameters

| Parameter       | Type                      | Description                     |
| --------------- | ------------------------- | ------------------------------- |
| `componentName` | `string`                  | Name to display in console logs |
| `props`         | `Record<string, unknown>` | Props object to track           |
