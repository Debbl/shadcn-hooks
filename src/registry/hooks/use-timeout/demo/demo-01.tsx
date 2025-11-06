'use client'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { useTimeout } from '..'

export function Demo01() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  const [delay, setDelay] = useState<number | null>(3000)

  const clear = useTimeout(() => {
    setCount((prev) => prev + 1)
    setMessage('Timeout executed! Count increased.')
  }, delay ?? -1)

  const handleStart = () => {
    setMessage('Timeout started, will execute in 3 seconds...')
    setDelay(3000)
  }

  const handleClear = () => {
    clear()
    setMessage('Timeout cleared!')
    setDelay(null)
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          Count: <span className='font-mono font-semibold'>{count}</span>
        </p>
        <p className='text-muted-foreground text-sm'>
          {message || 'Timeout will execute in 3 seconds after mount...'}
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <Button type='button' onClick={handleStart}>
          Start Timeout (3s)
        </Button>
        <Button type='button' variant='outline' onClick={handleClear}>
          Clear Timeout
        </Button>
      </div>
    </div>
  )
}
