'use client'
import { useEffect, useRef, useState } from 'react'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Slider } from '~/components/ui/slider'
import { useFps } from '..'

export function Demo01() {
  const [every, setEvery] = useState(10)
  const fps = useFps({ every })
  const [fpsHistory, setFpsHistory] = useState<number[]>([])
  const historyRef = useRef<number[]>([])

  useEffect(() => {
    if (fps > 0) {
      historyRef.current = [...historyRef.current, fps].slice(-30) // Keep last 30 readings
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setFpsHistory(historyRef.current)
    }
  }, [fps])

  const getFpsColor = (fpsValue: number) => {
    if (fpsValue >= 55) return 'text-green-600 dark:text-green-400'
    if (fpsValue >= 30) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getFpsBgColor = (fpsValue: number) => {
    if (fpsValue >= 55) return 'bg-green-500'
    if (fpsValue >= 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getFpsStatus = (fpsValue: number) => {
    if (fpsValue >= 55) return 'Excellent'
    if (fpsValue >= 30) return 'Good'
    if (fpsValue > 0) return 'Poor'
    return 'Not Available'
  }

  const getFpsBadgeVariant = (
    fpsValue: number,
  ): 'default' | 'secondary' | 'destructive' => {
    if (fpsValue >= 55) return 'default'
    if (fpsValue >= 30) return 'secondary'
    return 'destructive'
  }

  const averageFps =
    fpsHistory.length > 0
      ? Math.round(
          fpsHistory.reduce((sum, val) => sum + val, 0) / fpsHistory.length,
        )
      : 0

  const minFps = fpsHistory.length > 0 ? Math.min(...fpsHistory) : 0
  const maxFps = fpsHistory.length > 0 ? Math.max(...fpsHistory) : 0

  return (
    <div className='space-y-6'>
      <Card className='ring-0'>
        <CardHeader>
          <CardTitle>FPS Monitor</CardTitle>
          <CardDescription>
            Monitor your application's frames per second in real-time. Try
            scrolling or interacting with the page to see FPS changes.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='every'>Update Frequency (frames)</Label>
              <span className='text-muted-foreground text-sm'>
                Calculate FPS every {every} frame{every !== 1 ? 's' : ''}
              </span>
            </div>
            <Slider
              id='every'
              min={1}
              max={30}
              value={[every]}
              onValueChange={(value) => {
                const numValue = Array.isArray(value) ? value[0] : value
                if (
                  !Number.isNaN(numValue) &&
                  numValue >= 1 &&
                  numValue <= 30
                ) {
                  setEvery(numValue)
                }
              }}
            />
            <div className='text-muted-foreground flex justify-between text-xs'>
              <span>1</span>
              <span>15</span>
              <span>30</span>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='flex-1'>
                <div className='text-muted-foreground text-sm'>Current FPS</div>
                <div className={`text-4xl font-bold ${getFpsColor(fps)}`}>
                  {fps}
                </div>
              </div>
              <div className='flex-1'>
                <div className='text-muted-foreground text-sm'>Status</div>
                <Badge variant={getFpsBadgeVariant(fps)} className='text-lg'>
                  {getFpsStatus(fps)}
                </Badge>
              </div>
            </div>

            <div className='bg-muted relative h-6 w-full overflow-hidden rounded-full'>
              <div
                className={`h-full transition-all duration-300 ${getFpsBgColor(
                  fps,
                )} ${fps === 0 ? 'bg-gray-400' : ''}`}
                style={{ width: `${Math.min((fps / 60) * 100, 100)}%` }}
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-xs font-medium text-white dark:text-gray-900'>
                  {fps > 0 ? `${Math.round((fps / 60) * 100)}%` : '0%'}
                </span>
              </div>
            </div>

            {fpsHistory.length > 0 && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>FPS History</span>
                  <span className='text-muted-foreground text-xs'>
                    Last {fpsHistory.length} readings
                  </span>
                </div>
                <div className='bg-muted/30 relative h-24 w-full overflow-hidden rounded-lg border p-2'>
                  <div className='flex h-full items-end gap-0.5'>
                    {fpsHistory.map((value, index) => (
                      <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className={`flex-1 transition-all ${getFpsBgColor(
                          value,
                        )}`}
                        style={{
                          height: `${Math.min((value / 60) * 100, 100)}%`,
                        }}
                        title={`${value} FPS`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <Card size='sm' className='ring-0'>
                <CardContent className='pt-3'>
                  <div className='text-muted-foreground text-xs'>Target</div>
                  <div className='text-lg font-semibold'>60 FPS</div>
                </CardContent>
              </Card>
              <Card size='sm' className='ring-0'>
                <CardContent className='pt-3'>
                  <div className='text-muted-foreground text-xs'>Average</div>
                  <div
                    className={`text-lg font-semibold ${getFpsColor(averageFps)}`}
                  >
                    {averageFps || '-'} FPS
                  </div>
                </CardContent>
              </Card>
              <Card size='sm' className='ring-0'>
                <CardContent className='pt-3'>
                  <div className='text-muted-foreground text-xs'>Min</div>
                  <div
                    className={`text-lg font-semibold ${getFpsColor(minFps)}`}
                  >
                    {minFps || '-'} FPS
                  </div>
                </CardContent>
              </Card>
              <Card size='sm' className='ring-0'>
                <CardContent className='pt-3'>
                  <div className='text-muted-foreground text-xs'>Max</div>
                  <div
                    className={`text-lg font-semibold ${getFpsColor(maxFps)}`}
                  >
                    {maxFps || '-'} FPS
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='ring-0'>
        <CardContent className='pt-6'>
          <p className='text-muted-foreground text-sm'>
            <strong>Tip:</strong> Lower the update frequency (fewer frames) for
            more stable readings, or increase it for more responsive updates.
            The default is 10 frames. Try scrolling or interacting with the page
            to see how FPS changes in real-time.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
