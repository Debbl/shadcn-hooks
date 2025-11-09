import { useBoolean } from '@/registry/hooks/use-boolean'
import { useEventListener } from '@/registry/hooks/use-event-listener'
import type { BasicTarget } from '@/registry/lib/create-effect-with-target'

export interface Options {
  onEnter?: () => void
  onLeave?: () => void
  onChange?: (isHovering: boolean) => void
}

export function useHover(target: BasicTarget, options?: Options): boolean {
  const { onEnter, onLeave, onChange } = options || {}

  const [state, { setTrue, setFalse }] = useBoolean(false)

  useEventListener(
    'mouseenter',
    () => {
      onEnter?.()
      setTrue()
      onChange?.(true)
    },
    {
      target,
    },
  )

  useEventListener(
    'mouseleave',
    () => {
      onLeave?.()
      setFalse()
      onChange?.(false)
    },
    {
      target,
    },
  )

  return state
}
