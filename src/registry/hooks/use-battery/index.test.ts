import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBattery } from './index'
import type { UseBatteryState } from './index'

type BatterySnapshot = Pick<
  UseBatteryState,
  'charging' | 'chargingTime' | 'dischargingTime' | 'level'
>

type BatteryEventName =
  | 'chargingchange'
  | 'chargingtimechange'
  | 'dischargingtimechange'
  | 'levelchange'

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<MockBatteryManager>
}

class MockBatteryManager extends EventTarget {
  charging = false
  chargingTime = 0
  dischargingTime = 0
  level = 1

  constructor(initialState: Partial<BatterySnapshot> = {}) {
    super()
    this.update(initialState)
  }

  update(nextState: Partial<BatterySnapshot>) {
    Object.assign(this, nextState)
  }

  emit(eventName: BatteryEventName) {
    this.dispatchEvent(new Event(eventName))
  }
}

describe('useBattery', () => {
  let originalGetBattery: NavigatorWithBattery['getBattery']

  const setNavigatorGetBattery = (
    getBattery: NavigatorWithBattery['getBattery'],
  ) => {
    Object.defineProperty(navigator, 'getBattery', {
      configurable: true,
      writable: true,
      value: getBattery,
    })
  }

  beforeEach(() => {
    originalGetBattery = (navigator as NavigatorWithBattery).getBattery
  })

  afterEach(() => {
    setNavigatorGetBattery(originalGetBattery)
    vi.restoreAllMocks()
  })

  it('should return unsupported default state when Battery API is unavailable', () => {
    setNavigatorGetBattery(undefined)

    const { result } = renderHook(() => useBattery())

    expect(result.current.isSupported).toBe(false)
    expect(result.current.charging).toBe(false)
    expect(result.current.chargingTime).toBe(0)
    expect(result.current.dischargingTime).toBe(0)
    expect(result.current.level).toBe(1)
  })

  it('should read initial battery state', async () => {
    const battery = new MockBatteryManager({
      charging: true,
      chargingTime: 1200,
      dischargingTime: 0,
      level: 0.88,
    })
    const getBattery = vi.fn().mockResolvedValue(battery)
    setNavigatorGetBattery(getBattery)

    const { result } = renderHook(() => useBattery())

    await waitFor(() => {
      expect(result.current.charging).toBe(true)
    })

    expect(result.current.isSupported).toBe(true)
    expect(result.current.chargingTime).toBe(1200)
    expect(result.current.dischargingTime).toBe(0)
    expect(result.current.level).toBe(0.88)
    expect(getBattery).toHaveBeenCalledTimes(1)
  })

  it('should react to battery events', async () => {
    const battery = new MockBatteryManager({
      charging: false,
      chargingTime: 0,
      dischargingTime: 3600,
      level: 0.5,
    })
    setNavigatorGetBattery(vi.fn().mockResolvedValue(battery))

    const { result } = renderHook(() => useBattery())

    await waitFor(() => {
      expect(result.current.level).toBe(0.5)
    })

    act(() => {
      battery.update({
        charging: true,
        chargingTime: 1800,
        dischargingTime: 0,
        level: 0.75,
      })
      battery.emit('levelchange')
    })

    expect(result.current.charging).toBe(true)
    expect(result.current.chargingTime).toBe(1800)
    expect(result.current.dischargingTime).toBe(0)
    expect(result.current.level).toBe(0.75)
  })

  it('should unsubscribe from battery events on unmount', async () => {
    const battery = new MockBatteryManager()
    const addEventListenerSpy = vi.spyOn(battery, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(battery, 'removeEventListener')
    setNavigatorGetBattery(vi.fn().mockResolvedValue(battery))

    const { unmount } = renderHook(() => useBattery())

    await waitFor(() => {
      expect(addEventListenerSpy).toHaveBeenCalledTimes(4)
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(4)
  })
})
