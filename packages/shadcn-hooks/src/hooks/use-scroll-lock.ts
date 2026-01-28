import { useCallback, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
import { isBrowser } from '~/lib/is-browser'

interface UseScrollLockOptions {
  autoLock?: boolean
  lockTarget?: HTMLElement | string
  widthReflow?: boolean
}

interface UseScrollLockReturn {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

interface OriginalStyle {
  overflow: CSSStyleDeclaration['overflow']
  paddingRight: CSSStyleDeclaration['paddingRight']
}

export function useScrollLock(
  options: UseScrollLockOptions = {},
): UseScrollLockReturn {
  const { autoLock = true, lockTarget, widthReflow = true } = options
  const [isLocked, setIsLocked] = useState(false)
  const target = useRef<HTMLElement | null>(null)
  const originalStyle = useRef<OriginalStyle | null>(null)

  const lock = useCallback(() => {
    if (target.current) {
      const { overflow, paddingRight } = target.current.style

      // Save the original styles
      originalStyle.current = { overflow, paddingRight }

      // Prevent width reflow
      if (widthReflow) {
        // Use window inner width if body is the target as global scrollbar isn't part of the document
        const offsetWidth =
          target.current === document.body
            ? window.innerWidth
            : target.current.offsetWidth
        // Get current computed padding right in pixels
        const currentPaddingRight =
          Number.parseInt(
            window.getComputedStyle(target.current).paddingRight,
            10,
          ) || 0

        const scrollbarWidth = offsetWidth - target.current.scrollWidth
        target.current.style.paddingRight = `${scrollbarWidth + currentPaddingRight}px`
      }

      // Lock the scroll
      target.current.style.overflow = 'hidden'

      setIsLocked(true)
    }
  }, [widthReflow])

  const unlock = useCallback(() => {
    if (target.current && originalStyle.current) {
      target.current.style.overflow = originalStyle.current.overflow

      // Only reset padding right if we changed it
      if (widthReflow) {
        target.current.style.paddingRight = originalStyle.current.paddingRight
      }
    }

    setIsLocked(false)
  }, [widthReflow])

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) return

    if (lockTarget) {
      target.current =
        typeof lockTarget === 'string'
          ? document.querySelector(lockTarget)
          : lockTarget
    }

    if (!target.current) {
      target.current = document.body
    }

    if (autoLock) {
      lock()
    }

    return () => {
      unlock()
    }
  }, [autoLock, lockTarget, widthReflow])

  return { isLocked, lock, unlock }
}
