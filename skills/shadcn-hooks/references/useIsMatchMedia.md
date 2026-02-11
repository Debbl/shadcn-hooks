# useIsMatchMedia

Reactive CSS media query matching. Automatically updates when the media query result changes.

## Usage

```tsx
import { useIsMatchMedia } from '@/hooks/use-is-match-media'

function Component() {
  const isDark = useIsMatchMedia('(prefers-color-scheme: dark)')
  const isMobile = useIsMatchMedia('(max-width: 768px)')

  return (
    <div>
      <p>Dark mode: {isDark.toString()}</p>
      <p>Mobile: {isMobile.toString()}</p>
    </div>
  )
}
```

## Type Declarations

```ts
export function useIsMatchMedia(mediaQueryString: string): boolean
```

## Parameters

| Parameter          | Type     | Description            |
| ------------------ | -------- | ---------------------- |
| `mediaQueryString` | `string` | CSS media query string |

## Returns

| Type      | Description                               |
| --------- | ----------------------------------------- |
| `boolean` | Whether the media query currently matches |
