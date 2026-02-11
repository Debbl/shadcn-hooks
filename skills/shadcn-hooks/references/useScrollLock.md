# useScrollLock

Lock/unlock scroll on a target element. Handles scrollbar width reflow to prevent layout shifts.

## Usage

```tsx
import { useScrollLock } from '@/hooks/use-scroll-lock'

function Modal() {
  // Auto-locks body scroll when mounted, unlocks on unmount
  const { isLocked, lock, unlock } = useScrollLock()

  return (
    <div className='modal'>
      <p>Scroll is {isLocked ? 'locked' : 'unlocked'}</p>
      <button onClick={unlock}>Unlock scroll</button>
    </div>
  )
}
```

### Manual control

```tsx
const { isLocked, lock, unlock } = useScrollLock({ autoLock: false })

return (
  <button onClick={isLocked ? unlock : lock}>
    {isLocked ? 'Unlock' : 'Lock'} scroll
  </button>
)
```

### Custom target

```tsx
useScrollLock({ lockTarget: '#scrollable-container' })
```

## Type Declarations

```ts
interface UseScrollLockOptions {
  /** Auto-lock on mount @default true */
  autoLock?: boolean
  /** Target element or CSS selector @default document.body */
  lockTarget?: HTMLElement | string
  /** Compensate for scrollbar width @default true */
  widthReflow?: boolean
}

interface UseScrollLockReturn {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

export function useScrollLock(
  options?: UseScrollLockOptions,
): UseScrollLockReturn
```

## Parameters

| Parameter             | Type                    | Default         | Description                   |
| --------------------- | ----------------------- | --------------- | ----------------------------- |
| `options.autoLock`    | `boolean`               | `true`          | Lock scroll on mount          |
| `options.lockTarget`  | `HTMLElement \| string` | `document.body` | Element to lock               |
| `options.widthReflow` | `boolean`               | `true`          | Add padding to prevent reflow |

## Returns

| Property   | Type         | Description              |
| ---------- | ------------ | ------------------------ |
| `isLocked` | `boolean`    | Whether scroll is locked |
| `lock`     | `() => void` | Lock scroll              |
| `unlock`   | `() => void` | Unlock scroll            |
