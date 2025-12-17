'use client'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useIsOnline } from '..'

export function Demo01() {
  const isOnline = useIsOnline()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Online Status</CardTitle>
        <CardDescription>
          Monitor your network connection status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Is Online:</span>
          <Badge variant={isOnline ? 'default' : 'destructive'}>
            {isOnline ? 'Yes' : 'No'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
