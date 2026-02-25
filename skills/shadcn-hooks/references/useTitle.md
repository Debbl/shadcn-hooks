# useTitle

Reactive `document.title` management with optional external change observation and title templates.

## Usage

```tsx
import { useTitle } from '@/hooks/use-title'

function Component() {
  const [title, setTitle] = useTitle('Dashboard', {
    titleTemplate: '%s | My App',
  })

  return (
    <button type='button' onClick={() => setTitle('Settings')}>
      Current title: {title}
    </button>
  )
}
```

## Type Declarations

```ts
import type { Dispatch, SetStateAction } from 'react'

export interface UseTitleOptions {
  observe?: boolean
  titleTemplate?: string | ((title: string) => string)
}

export function useTitle(
  newTitle?: string | null,
  options?: UseTitleOptions,
): readonly [string, Dispatch<SetStateAction<string>>]
```

## Parameters

| Parameter               | Type                                    | Default | Description                                      |
| ----------------------- | --------------------------------------- | ------- | ------------------------------------------------ |
| `newTitle`              | `string \| null \| undefined`           | —       | Optional initial/controlled title value          |
| `options.observe`       | `boolean`                               | `false` | Observe external `document.title` changes        |
| `options.titleTemplate` | `string \| ((title: string) => string)` | —       | Template/formatter for the browser title display |

## Returns

| Type                                                  | Description                                |
| ----------------------------------------------------- | ------------------------------------------ |
| `readonly [string, Dispatch<SetStateAction<string>>]` | Current title and React-style title setter |
