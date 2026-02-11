# useClipboard

Reactive Clipboard API with read/write support. Includes permission handling and legacy fallback.

## Usage

```tsx
import { useClipboard } from 'shadcn-hooks'

function Component() {
  const { text, copied, copy, isSupported } = useClipboard()

  return (
    <div>
      <button onClick={() => copy('Hello!')}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <p>Clipboard: {text}</p>
    </div>
  )
}
```

### With source

```tsx
const { copy, copied } = useClipboard({ source: 'predefined text' })

// copy() without arguments uses the source
;<button onClick={() => copy()}>{copied ? 'Copied!' : 'Copy'}</button>
```

## Type Declarations

```ts
export interface UseClipboardOptions {
  /** Enable reading clipboard content @default false */
  read?: boolean
  /** Copy source text */
  source?: string
  /** Milliseconds to reset `copied` state @default 1500 */
  copiedDuring?: number
  /** Fallback to document.execCommand('copy') @default false */
  legacy?: boolean
}

export interface UseClipboardReturn {
  isSupported: boolean
  text: string
  copied: boolean
  copy: (text?: string) => Promise<void>
}

export function useClipboard(options?: UseClipboardOptions): UseClipboardReturn
```

## Parameters

| Parameter              | Type      | Default | Description                                 |
| ---------------------- | --------- | ------- | ------------------------------------------- |
| `options.read`         | `boolean` | `false` | Enable reading clipboard on copy/cut events |
| `options.source`       | `string`  | —       | Default text for `copy()`                   |
| `options.copiedDuring` | `number`  | `1500`  | Duration `copied` stays `true` (ms)         |
| `options.legacy`       | `boolean` | `false` | Use `execCommand('copy')` fallback          |

## Returns

| Property      | Type                               | Description                                                  |
| ------------- | ---------------------------------- | ------------------------------------------------------------ |
| `isSupported` | `boolean`                          | Whether Clipboard API is available                           |
| `text`        | `string`                           | Current clipboard text                                       |
| `copied`      | `boolean`                          | `true` after a successful copy (resets after `copiedDuring`) |
| `copy`        | `(text?: string) => Promise<void>` | Copy text to clipboard                                       |
