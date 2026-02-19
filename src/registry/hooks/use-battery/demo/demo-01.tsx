'use client'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { useBattery } from '..'

export function Demo01() {
  const battery = useBattery()
  const batteryPercent = Math.round(battery.level * 100)

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Battery Status</CardTitle>
        <CardDescription>
          Monitor charge level and charging state in real time
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Support:</span>
          <Badge variant={battery.isSupported ? 'default' : 'secondary'}>
            {battery.isSupported ? 'Supported' : 'Not Supported'}
          </Badge>
        </div>

        {battery.isSupported && (
          <>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='font-medium'>Level</span>
                <span className='text-muted-foreground'>{batteryPercent}%</span>
              </div>
              <Progress value={batteryPercent} />
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>Charging:</span>
              <Badge variant={battery.charging ? 'default' : 'outline'}>
                {battery.charging ? 'Yes' : 'No'}
              </Badge>
            </div>

            <div className='grid gap-2 text-sm'>
              <p className='text-muted-foreground'>
                Charging time: {battery.chargingTime}s
              </p>
              <p className='text-muted-foreground'>
                Discharging time: {battery.dischargingTime}s
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
