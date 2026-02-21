# useBattery

Monitor battery level and charging state from the Battery Status API.

## Usage

```tsx
import { useBattery } from '@/hooks/use-battery'

function Component() {
  const battery = useBattery()

  return (
    <div>
      <p>Supported: {battery.isSupported.toString()}</p>
      <p>Charging: {battery.charging.toString()}</p>
      <p>Level: {Math.round(battery.level * 100)}%</p>
      <p>Charging time: {battery.chargingTime}s</p>
      <p>Discharging time: {battery.dischargingTime}s</p>
    </div>
  )
}
```

## Type Declarations

```ts
export interface UseBatteryState {
  isSupported: boolean
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}

export function useBattery(): UseBatteryState
```

## Parameters

None.

## Returns

| Property          | Type      | Description                                  |
| ----------------- | --------- | -------------------------------------------- |
| `isSupported`     | `boolean` | Whether `navigator.getBattery` is available  |
| `charging`        | `boolean` | Whether the device is currently charging     |
| `chargingTime`    | `number`  | Seconds until fully charged (`0` if unknown) |
| `dischargingTime` | `number`  | Seconds until empty (`0` if unknown)         |
| `level`           | `number`  | Battery level from `0` to `1`                |
