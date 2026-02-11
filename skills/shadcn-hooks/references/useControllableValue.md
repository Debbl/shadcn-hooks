# useControllableValue

Supports both controlled and uncontrolled component patterns. Automatically detects whether a component is controlled (value provided via props) or uncontrolled (manages its own internal state).

## Usage

### Uncontrolled

```tsx
import { useControllableValue } from 'shadcn-hooks'

function Input(props: Record<string, unknown>) {
  const [value, setValue] = useControllableValue<string>(props, {
    defaultValue: '',
  })

  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}

// Parent — no value prop, component manages its own state
;<Input onChange={(v) => console.log(v)} />
```

### Controlled

```tsx
function App() {
  const [text, setText] = useState('hello')

  // Parent provides `value` — the component becomes controlled
  return <Input value={text} onChange={setText} />
}
```

## Type Declarations

```ts
export interface Options<T> {
  defaultValue?: T
  defaultValuePropName?: string
  valuePropName?: string
  trigger?: string
}

export interface StandardProps<T> {
  value: T
  defaultValue?: T
  onChange: (val: T) => void
}

export function useControllableValue<T>(
  props: StandardProps<T>,
): [T, (v: SetStateAction<T>) => void]

export function useControllableValue<T>(
  props?: Record<string, unknown>,
  options?: Options<T>,
): [T, (v: SetStateAction<T>, ...args: unknown[]) => void]
```

## Parameters

| Parameter                      | Type                      | Default          | Description                       |
| ------------------------------ | ------------------------- | ---------------- | --------------------------------- |
| `props`                        | `Record<string, unknown>` | —                | Component props object            |
| `options.defaultValue`         | `T`                       | `undefined`      | Fallback default value            |
| `options.defaultValuePropName` | `string`                  | `'defaultValue'` | Prop name for default value       |
| `options.valuePropName`        | `string`                  | `'value'`        | Prop name for controlled value    |
| `options.trigger`              | `string`                  | `'onChange'`     | Prop name for the change callback |

## Returns

A tuple `[value, setValue]`.
