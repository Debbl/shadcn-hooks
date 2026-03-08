import { useEffect, useState } from 'react'

export type UseOSReturnValue =
  | 'undetermined'
  | 'macos'
  | 'ios'
  | 'windows'
  | 'android'
  | 'linux'
  | 'chromeos'

export interface UseOsOptions {
  /**
   * Defer browser OS detection until after mount to avoid server/client mismatches.
   * @default true
   */
  getValueInEffect?: boolean
}

interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: {
    platform?: string
  }
}

function getPlatform(): string {
  if (typeof navigator === 'undefined') {
    return ''
  }

  const nav = navigator as NavigatorWithUserAgentData

  return (nav.userAgentData?.platform ?? navigator.platform ?? '').toLowerCase()
}

function getUserAgent(): string {
  if (typeof navigator === 'undefined') {
    return ''
  }

  return navigator.userAgent.toLowerCase()
}

/**
 * Detect the current operating system from the browser environment.
 *
 * @param options Hook options.
 * @returns The detected operating system or `undetermined`.
 */
export function getOS(options: UseOsOptions = {}): UseOSReturnValue {
  const { getValueInEffect = true } = options

  if (getValueInEffect || typeof navigator === 'undefined') {
    return 'undetermined'
  }

  const platform = getPlatform()
  const userAgent = getUserAgent()
  const maxTouchPoints = navigator.maxTouchPoints ?? 0

  if (userAgent.includes('android')) {
    return 'android'
  }

  if (
    /iphone|ipad|ipod/.test(userAgent) ||
    (platform === 'macintel' && maxTouchPoints > 1)
  ) {
    return 'ios'
  }

  if (userAgent.includes('cros')) {
    return 'chromeos'
  }

  if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows'
  }

  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'macos'
  }

  if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux'
  }

  return 'undetermined'
}

/**
 * Reactively detect the current operating system from `navigator.userAgent`.
 *
 * @param options Hook options.
 * @returns The detected operating system or `undetermined`.
 */
export function useOs(options: UseOsOptions = {}): UseOSReturnValue {
  const { getValueInEffect = true } = options
  const [os, setOs] = useState<UseOSReturnValue>(() =>
    getOS({ getValueInEffect }),
  )

  useEffect(() => {
    setOs(getOS({ getValueInEffect: false }))
  }, [getValueInEffect])

  return os
}
