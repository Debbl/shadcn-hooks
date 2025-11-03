import { useInView } from 'motion/react'
import * as React from 'react'
import type { UseInViewOptions } from 'motion/react'

interface UseIsInViewOptions {
  inView?: boolean
  inViewOnce?: boolean
  inViewMargin?: UseInViewOptions['margin']
}

function useIsInView<T extends HTMLElement = HTMLElement>(
  ref: React.Ref<T>,
  options: UseIsInViewOptions = {},
) {
  const { inView, inViewOnce = false, inViewMargin = '0px' } = options
  const localRef = React.useRef<T>(null)
  React.useImperativeHandle(ref, () => localRef.current as T)
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  })
  const isInView = !inView || inViewResult
  return { ref: localRef, isInView }
}

// eslint-disable-next-line react-refresh/only-export-components
export { useIsInView, type UseIsInViewOptions }
