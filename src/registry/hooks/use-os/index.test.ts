import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getOS, useOs } from './index'

describe('useOs', () => {
  const setNavigatorState = ({
    userAgent,
    platform,
    maxTouchPoints = 0,
  }: {
    userAgent: string
    platform: string
    maxTouchPoints?: number
  }) => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: userAgent,
    })

    Object.defineProperty(window.navigator, 'platform', {
      configurable: true,
      value: platform,
    })

    Object.defineProperty(window.navigator, 'maxTouchPoints', {
      configurable: true,
      value: maxTouchPoints,
    })
  }

  beforeEach(() => {
    setNavigatorState({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      platform: 'MacIntel',
    })
  })

  afterEach(() => {
    Reflect.deleteProperty(window.navigator, 'userAgent')
    Reflect.deleteProperty(window.navigator, 'platform')
    Reflect.deleteProperty(window.navigator, 'maxTouchPoints')
  })

  it('should return undetermined by default before reading browser values', () => {
    expect(getOS()).toBe('undetermined')
  })

  it('should detect macos', () => {
    expect(getOS({ getValueInEffect: false })).toBe('macos')
  })

  it('should detect windows', () => {
    setNavigatorState({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      platform: 'Win32',
    })

    expect(getOS({ getValueInEffect: false })).toBe('windows')
  })

  it('should detect linux', () => {
    setNavigatorState({
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      platform: 'Linux x86_64',
    })

    expect(getOS({ getValueInEffect: false })).toBe('linux')
  })

  it('should detect android', () => {
    setNavigatorState({
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36',
      platform: 'Linux armv8l',
    })

    expect(getOS({ getValueInEffect: false })).toBe('android')
  })

  it('should detect ios from user agent', () => {
    setNavigatorState({
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      platform: 'iPhone',
    })

    expect(getOS({ getValueInEffect: false })).toBe('ios')
  })

  it('should detect ios from ipad desktop mode', () => {
    setNavigatorState({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    })

    expect(getOS({ getValueInEffect: false })).toBe('ios')
  })

  it('should detect chromeos', () => {
    setNavigatorState({
      userAgent: 'Mozilla/5.0 (X11; CrOS x86_64 15474.61.0) AppleWebKit/537.36',
      platform: 'Linux x86_64',
    })

    expect(getOS({ getValueInEffect: false })).toBe('chromeos')
  })

  it('should return undetermined for unknown environments', () => {
    setNavigatorState({
      userAgent: 'CustomBrowser/1.0',
      platform: 'Unknown',
    })

    expect(getOS({ getValueInEffect: false })).toBe('undetermined')
  })

  it('should resolve the OS after mount by default', () => {
    setNavigatorState({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      platform: 'Win32',
    })

    const { result } = renderHook(() => useOs())

    expect(result.current).toBe('windows')
  })

  it('should read the OS immediately when getValueInEffect is false', () => {
    setNavigatorState({
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36',
      platform: 'Linux armv8l',
    })

    const { result } = renderHook(() => useOs({ getValueInEffect: false }))

    expect(result.current).toBe('android')
  })
})
