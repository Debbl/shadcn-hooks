'use client'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useNetwork } from '..'

export function Demo01() {
  const network = useNetwork()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Status</CardTitle>
        <CardDescription>Monitor your network connection state</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Status:</span>
          <Badge variant={network.online ? 'default' : 'destructive'}>
            {network.online ? 'Online' : 'Offline'}
          </Badge>
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
            <Badge variant='outline'>{network.effectiveType}</Badge>
          </div>
        )}

        {network.type && (
          <div>
            <span className='text-sm font-medium'>Connection Type: </span>
            <Badge variant='outline'>{network.type}</Badge>
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
            <Badge variant={network.saveData ? 'secondary' : 'outline'}>
              {network.saveData ? 'Enabled' : 'Disabled'}
            </Badge>
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
      </CardContent>
    </Card>
  )
}
