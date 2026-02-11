# useNetwork

Reactive network connection information including online status, connection type, downlink speed, and more.

## Usage

```tsx
import { useNetwork } from 'shadcn-hooks'

function Component() {
  const network = useNetwork()

  return (
    <div>
      <p>Online: {network.online?.toString()}</p>
      <p>Type: {network.type}</p>
      <p>Effective type: {network.effectiveType}</p>
      <p>Downlink: {network.downlink} Mbps</p>
      <p>RTT: {network.rtt} ms</p>
      <p>Save data: {network.saveData?.toString()}</p>
    </div>
  )
}
```

## Type Declarations

```ts
export interface NetworkState {
  since?: Date
  online?: boolean
  rtt?: number
  type?: string
  downlink?: number
  saveData?: boolean
  downlinkMax?: number
  effectiveType?: string
}

export function useNetwork(): NetworkState
```

## Parameters

None.

## Returns

| Property        | Type                   | Description                                 |
| --------------- | ---------------------- | ------------------------------------------- |
| `since`         | `Date \| undefined`    | Timestamp of last status change             |
| `online`        | `boolean \| undefined` | Whether browser is online                   |
| `rtt`           | `number \| undefined`  | Round-trip time (ms)                        |
| `type`          | `string \| undefined`  | Connection type (e.g. `wifi`, `cellular`)   |
| `downlink`      | `number \| undefined`  | Downlink speed (Mbps)                       |
| `saveData`      | `boolean \| undefined` | Whether data saver is enabled               |
| `downlinkMax`   | `number \| undefined`  | Max downlink speed                          |
| `effectiveType` | `string \| undefined`  | Effective connection type (e.g. `4g`, `3g`) |
