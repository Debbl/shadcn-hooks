'use client'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useInterval } from '..'

export function Demo01() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  const [delay, setDelay] = useState<number | undefined>(1000)

  const clear = useInterval(() => {
    setCount((prev) => prev + 1)
    setMessage('Interval executed! Count increased.')
  }, delay)

  const handleStart = () => {
    setMessage('Interval started, will execute every second...')
    setDelay(1000)
  }

  const handlePause = () => {
    setDelay(undefined)
    setMessage('Interval paused!')
  }

  const handleClear = () => {
    clear()
    setMessage('Interval cleared!')
    setDelay(undefined)
  }

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Interval Demo</CardTitle>
        <CardDescription>
          Execute a function repeatedly at specified intervals
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <p className='text-muted-foreground text-sm'>
            Count: <span className='font-mono font-semibold'>{count}</span>
          </p>
          <p className='text-muted-foreground text-sm'>
            {message || 'Interval will execute every second after mount...'}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button type='button' onClick={handleStart}>
            Start Interval (1s)
          </Button>
          <Button type='button' variant='outline' onClick={handlePause}>
            Pause Interval
          </Button>
          <Button type='button' variant='outline' onClick={handleClear}>
            Clear Interval
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
