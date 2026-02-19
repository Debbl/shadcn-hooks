import { useEffect, useState } from 'react'

type BatteryEventName =
  | 'chargingchange'
  | 'chargingtimechange'
  | 'dischargingtimechange'
  | 'levelchange'

const BATTERY_EVENTS: BatteryEventName[] = [
  'chargingchange',
  'chargingtimechange',
  'dischargingtimechange',
  'levelchange',
]

const DEFAULT_BATTERY_STATE = {
  charging: false,
  chargingTime: 0,
  dischargingTime: 0,
  level: 1,
}

interface BatteryManagerLike extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManagerLike>
}

export interface UseBatteryState {
  isSupported: boolean
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}

function isBatterySupported(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }

  const nav = navigator as NavigatorWithBattery
  return typeof nav.getBattery === 'function'
}

/**
 * Monitor the current battery information using the Battery Status API.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API
 * @returns Current battery state and support flag.
 */
export function useBattery(): UseBatteryState {
  const isSupported = isBatterySupported()

  const [state, setState] = useState<UseBatteryState>(() => ({
    isSupported,
    ...DEFAULT_BATTERY_STATE,
  }))

  useEffect(() => {
    if (!isSupported) {
      return
    }

    const nav = navigator as NavigatorWithBattery
    let battery: BatteryManagerLike | null = null
    let disposed = false

    const updateBatteryState = () => {
      if (!battery || disposed) {
        return
      }

      setState({
        isSupported: true,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        level: battery.level,
      })
    }

    void nav
      .getBattery?.()
      .then((batteryManager) => {
        if (disposed) {
          return
        }

        battery = batteryManager
        updateBatteryState()

        BATTERY_EVENTS.forEach((eventName) => {
          batteryManager.addEventListener(eventName, updateBatteryState)
        })
      })
      .catch(() => {
        // Keep default values when runtime access fails.
      })

    return () => {
      disposed = true

      if (!battery) {
        return
      }

      BATTERY_EVENTS.forEach((eventName) => {
        battery?.removeEventListener(eventName, updateBatteryState)
      })
    }
  }, [isSupported])

  return state
}
