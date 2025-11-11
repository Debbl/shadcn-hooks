import { useEventListener } from '@/registry/hooks/use-event-listener'

export function useClickAnyWhere(handler: (event: MouseEvent) => void) {
  useEventListener('click', handler)
}
