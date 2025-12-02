import { useEffect, useRef, useState } from 'react'
import { isBrowser } from '~/lib/is-browser'

export interface UseFpsProps {
  /**
   * Calculate the FPS on every x frames.
   * @default 10
   */
  every?: number
}

export function useFps(options?: UseFpsProps) {
  const { every = 10 } = options ?? {}
  const [fps, setFps] = useState<number>(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (
      !isBrowser ||
      typeof performance === 'undefined' ||
      typeof requestAnimationFrame === 'undefined'
    ) {
      return
    }

    let frameCount = 0
    let lastFpsUpdate = performance.now()

    const measureFps = () => {
      const now = performance.now()
      frameCount++

      // Update FPS every x frames
      if (frameCount >= every) {
        const timeDiff = now - lastFpsUpdate
        // Avoid division by zero or very small numbers
        const currentFps =
          timeDiff > 0 ? Math.round((frameCount * 1000) / timeDiff) : 0
        setFps(currentFps)
        frameCount = 0
        lastFpsUpdate = now
      }

      frameRef.current = requestAnimationFrame(measureFps)
    }

    frameRef.current = requestAnimationFrame(measureFps)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [every])

  return fps
}
