import { useEffect, useMemo, useRef, useState } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useMemoizedFn } from '~/hooks/use-memoized-fn'
import { useUnmount } from '~/hooks/use-unmount'
import { isBrowser } from '~/lib/is-browser'

export interface UseClipboardOptions {
  /**
   * Enabled reading for clipboard
   *
   * @default false
   */
  read?: boolean

  /**
   * Copy source
   */
  source?: string

  /**
   * Milliseconds to reset state of `copied` ref
   *
   * @default 1500
   */
  copiedDuring?: number

  /**
   * Whether fallback to document.execCommand('copy') if clipboard is undefined.
   *
   * @default false
   */
  legacy?: boolean
}

export interface UseClipboardReturn {
  isSupported: boolean
  text: string
  copied: boolean
  copy: (text?: string) => Promise<void>
}

type PermissionState = 'granted' | 'denied' | 'prompt' | undefined

function isAllowed(status: PermissionState): boolean {
  return status === 'granted' || status === 'prompt'
}

function legacyCopy(value: string): void {
  const ta = document.createElement('textarea')
  ta.value = value
  ta.style.position = 'absolute'
  ta.style.opacity = '0'
  ta.setAttribute('readonly', '')
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  ta.remove()
}

function legacyRead(): string {
  return document?.getSelection?.()?.toString() ?? ''
}

/**
 * Reactive Clipboard API.
 *
 * @param options - Configuration options
 * @returns Clipboard state and methods
 */
export function useClipboard(
  options: UseClipboardOptions = {},
): UseClipboardReturn {
  const { read = false, source, copiedDuring = 1500, legacy = false } = options

  const [text, setText] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [permissionRead, setPermissionRead] =
    useState<PermissionState>(undefined)
  const [permissionWrite, setPermissionWrite] =
    useState<PermissionState>(undefined)

  const timeoutRef = useRef<number | null>(null)

  const isClipboardApiSupported = useMemo(() => {
    if (!isBrowser) return false
    return 'clipboard' in navigator
  }, [])

  const isSupported = useMemo(() => {
    return isClipboardApiSupported || legacy
  }, [isClipboardApiSupported, legacy])

  // Check permissions
  useEffect(() => {
    if (!isBrowser || !isClipboardApiSupported) return

    const checkPermissions = async () => {
      try {
        if ('permissions' in navigator) {
          const readPermission = await navigator.permissions.query({
            name: 'clipboard-read' as PermissionName,
          })
          setPermissionRead(readPermission.state)
          readPermission.onchange = () => {
            setPermissionRead(readPermission.state)
          }

          const writePermission = await navigator.permissions.query({
            name: 'clipboard-write' as PermissionName,
          })
          setPermissionWrite(writePermission.state)
          writePermission.onchange = () => {
            setPermissionWrite(writePermission.state)
          }
        }
      } catch {
        // Permissions API might not be supported or clipboard permissions might not be queryable
        // In this case, we'll try to use the clipboard API directly
      }
    }

    checkPermissions()
  }, [isClipboardApiSupported])

  const updateText = useMemoizedFn(async () => {
    let useLegacy = !(isClipboardApiSupported && isAllowed(permissionRead))
    if (!useLegacy) {
      try {
        const clipboardText = await navigator.clipboard.readText()
        setText(clipboardText)
      } catch {
        useLegacy = true
      }
    }
    if (useLegacy) {
      setText(legacyRead())
    }
  })

  // Listen to copy/cut events if read is enabled
  useEventListener(isSupported && read ? ['copy', 'cut'] : [], updateText, {
    passive: true,
    enable: isSupported && read,
  })

  const copy = useMemoizedFn(async (value?: string) => {
    const textToCopy = value ?? source
    if (!isSupported || textToCopy == null) return

    let useLegacy = !(isClipboardApiSupported && isAllowed(permissionWrite))
    if (!useLegacy) {
      try {
        await navigator.clipboard.writeText(textToCopy)
      } catch {
        useLegacy = true
      }
    }
    if (useLegacy) {
      legacyCopy(textToCopy)
    }

    setText(textToCopy)
    setCopied(true)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = window.setTimeout(() => {
      setCopied(false)
      timeoutRef.current = null
    }, copiedDuring)
  })

  // Cleanup timeout on unmount
  useUnmount(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  })

  return {
    isSupported,
    text,
    copied,
    copy,
  }
}
