# useOs

Reactive browser OS detection with an SSR-safe fallback.

## Usage

```tsx
import { useOs } from '@/hooks/use-os'

function Component() {
  const os = useOs()

  return <p>Current OS: {os}</p>
}
```

## Type Declarations

```ts
export type UseOSReturnValue =
  | 'undetermined'
  | 'macos'
  | 'ios'
  | 'windows'
  | 'android'
  | 'linux'
  | 'chromeos'

export interface UseOsOptions {
  getValueInEffect?: boolean
}

export function getOS(options?: UseOsOptions): UseOSReturnValue
export function useOs(options?: UseOsOptions): UseOSReturnValue
```

## Parameters

| Parameter                  | Type      | Default | Description                                                            |
| -------------------------- | --------- | ------- | ---------------------------------------------------------------------- |
| `options.getValueInEffect` | `boolean` | `true`  | Delay OS detection until after mount to avoid SSR hydration mismatches |

## Returns

| Type               | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `UseOSReturnValue` | The detected operating system or `undetermined` when it cannot be resolved |
