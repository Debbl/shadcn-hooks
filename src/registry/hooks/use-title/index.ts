import { useEffect, useMemo, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from '@/registry/hooks/use-isomorphic-layout-effect'
import type { Dispatch, SetStateAction } from 'react'

export interface UseTitleOptions {
  /**
   * Observe external changes to `document.title`.
   * @default false
   */
  observe?: boolean
  /**
   * Optional template for the final browser title.
   * Use `%s` as the placeholder when providing a string template.
   */
  titleTemplate?: string | ((title: string) => string)
}

function getDocumentTitle(): string {
  if (typeof document === 'undefined') {
    return ''
  }

  return document.title
}

function parseTemplate(
  titleTemplate?: string | ((title: string) => string),
): (title: string) => string {
  if (typeof titleTemplate === 'function') {
    return titleTemplate
  }

  if (typeof titleTemplate === 'string' && titleTemplate.includes('%s')) {
    return (title: string) => titleTemplate.replaceAll('%s', title)
  }

  return (title: string) => title
}

/**
 * Reactively read and update `document.title`.
 *
 * @param newTitle Optional initial/controlled title value.
 * @param options Hook options.
 */
export function useTitle(
  newTitle?: string | null,
  options: UseTitleOptions = {},
): readonly [string, Dispatch<SetStateAction<string>>] {
  const { observe = false, titleTemplate } = options
  const formatTitle = useMemo(
    () => parseTemplate(titleTemplate),
    [titleTemplate],
  )
  const [title, setTitle] = useState<string>(
    () => newTitle ?? getDocumentTitle(),
  )
  const skipNextMutationRef = useRef(false)

  useEffect(() => {
    if (newTitle == null) {
      return
    }

    setTitle((currentTitle) =>
      currentTitle === newTitle ? currentTitle : newTitle,
    )
  }, [newTitle])

  useIsomorphicLayoutEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const nextDocumentTitle = formatTitle(title)
    if (document.title !== nextDocumentTitle) {
      skipNextMutationRef.current = true
      document.title = nextDocumentTitle
    }
  }, [formatTitle, title])

  useEffect(() => {
    if (!observe || typeof document === 'undefined') {
      return
    }

    if (typeof MutationObserver === 'undefined') {
      return
    }

    const titleElement = document.querySelector('title')
    if (!titleElement) {
      return
    }

    const observer = new MutationObserver(() => {
      if (skipNextMutationRef.current) {
        skipNextMutationRef.current = false
        return
      }

      setTitle((currentTitle) => {
        const nextTitle = document.title
        return currentTitle === nextTitle ? currentTitle : nextTitle
      })
    })

    observer.observe(titleElement, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [observe])

  return [title, setTitle] as const
}
