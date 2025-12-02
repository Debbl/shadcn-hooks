'use client'
import { cls } from 'twl'
import { useNetwork } from '..'

export function Demo01() {
  const network = useNetwork()

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='mb-2 text-lg font-semibold'>Network Status</h3>
        <p className='text-muted-foreground mb-4 text-sm'>
          Monitor your network connection state
        </p>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Status:</span>
          <span
            className={cls`rounded px-2 py-1 text-sm ${
              network.online
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {network.online ? 'Online' : 'Offline'}
          </span>
        </div>

        {network.since && (
          <div>
            <span className='text-sm font-medium'>Last Updated: </span>
            <span className='text-muted-foreground text-sm'>
              {network.since.toLocaleTimeString()}
            </span>
          </div>
        )}

        {network.effectiveType && (
          <div>
            <span className='text-sm font-medium'>Effective Type: </span>
            <span className='rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800'>
              {network.effectiveType}
            </span>
          </div>
        )}

        {network.type && (
          <div>
            <span className='text-sm font-medium'>Connection Type: </span>
            <span className='rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800'>
              {network.type}
            </span>
          </div>
        )}

        {typeof network.downlink === 'number' && (
          <div>
            <span className='text-sm font-medium'>Downlink: </span>
            <span className='text-muted-foreground text-sm'>
              {network.downlink} Mbps
            </span>
          </div>
        )}

        {typeof network.rtt === 'number' && (
          <div>
            <span className='text-sm font-medium'>Round-Trip Time: </span>
            <span className='text-muted-foreground text-sm'>
              {network.rtt} ms
            </span>
          </div>
        )}

        {typeof network.saveData === 'boolean' && (
          <div>
            <span className='text-sm font-medium'>Save Data: </span>
            <span
              className={cls`rounded px-2 py-1 text-sm ${
                network.saveData
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {network.saveData ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        )}

        {typeof network.downlinkMax === 'number' && (
          <div>
            <span className='text-sm font-medium'>Max Downlink: </span>
            <span className='text-muted-foreground text-sm'>
              {network.downlinkMax} Mbps
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
