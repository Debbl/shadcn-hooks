import { useState } from 'react'
import { useEffectWithTarget } from '@/registry/hooks/use-effect-with-target'
import { getTargetElement } from '@/registry/lib/create-effect-with-target'
import type { BasicTarget } from '@/registry/lib/create-effect-with-target'

export interface ElementSize {
  width: number
  height: number
}

export interface UseElementSizeOptions {
  /**
   * ResizeObserver box model to use for measuring.
   *
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions
}

const defaultInitialSize: ElementSize = {
  width: 0,
  height: 0,
}

type ResizeObserverBoxSize =
  | ResizeObserverSize
  | ReadonlyArray<ResizeObserverSize>

function toBoxSizeArray(
  boxSize: ResizeObserverBoxSize | undefined,
): readonly ResizeObserverSize[] {
  if (!boxSize) {
    return []
  }

  return Array.isArray(boxSize)
    ? boxSize
    : ([boxSize] as readonly ResizeObserverSize[])
}

function getSizeFromEntry(
  entry: ResizeObserverEntry,
  box: ResizeObserverBoxOptions,
): ElementSize {
  const boxSize =
    box === 'border-box'
      ? entry.borderBoxSize
      : box === 'device-pixel-content-box'
        ? entry.devicePixelContentBoxSize
        : entry.contentBoxSize

  const sizes = toBoxSizeArray(boxSize)

  if (sizes.length > 0) {
    return {
      width: sizes.reduce((sum, size) => sum + size.inlineSize, 0),
      height: sizes.reduce((sum, size) => sum + size.blockSize, 0),
    }
  }

  return {
    width: entry.contentRect.width,
    height: entry.contentRect.height,
  }
}

function isSvgElement(element: Element): element is SVGElement {
  return typeof SVGElement !== 'undefined' && element instanceof SVGElement
}

export function useElementSize(
  target: BasicTarget<Element>,
  initialSize: ElementSize = defaultInitialSize,
  options: UseElementSizeOptions = {},
): ElementSize {
  const { box = 'content-box' } = options
  const [size, setSize] = useState<ElementSize>(initialSize)

  const updateSize = (nextSize: ElementSize) => {
    setSize((currentSize) => {
      if (
        currentSize.width === nextSize.width &&
        currentSize.height === nextSize.height
      ) {
        return currentSize
      }

      return nextSize
    })
  }

  useEffectWithTarget(
    () => {
      const element = getTargetElement(target)

      if (!element) {
        updateSize({ width: 0, height: 0 })
        return
      }

      updateSize(initialSize)

      if (typeof ResizeObserver === 'undefined') {
        const rect = element.getBoundingClientRect()
        updateSize({
          width: rect.width,
          height: rect.height,
        })

        return
      }

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) {
          return
        }

        if (isSvgElement(element)) {
          const rect = element.getBoundingClientRect()
          updateSize({
            width: rect.width,
            height: rect.height,
          })
          return
        }

        updateSize(getSizeFromEntry(entry, box))
      })

      try {
        observer.observe(element, { box })
      } catch {
        observer.observe(element)
      }

      return () => {
        observer.disconnect()
      }
    },
    [box, initialSize.width, initialSize.height],
    target,
  )

  return size
}
