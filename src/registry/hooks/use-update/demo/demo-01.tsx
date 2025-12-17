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
import { useUpdate } from '..'

let renderCount = 0

export function Demo01() {
  const [count, setCount] = useState(0)
  const update = useUpdate()

  // Increment render count on each render
  renderCount++

  const handleIncrement = () => {
    setCount((prev) => prev + 1)
  }

  const handleForceUpdate = () => {
    update()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Demo</CardTitle>
        <CardDescription>
          Force a component re-render without changing state
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <p className='text-muted-foreground text-sm'>
            Render count:{' '}
            <span className='font-mono font-semibold'>{renderCount}</span>
          </p>
          <p className='text-muted-foreground text-sm'>
            Count: <span className='font-mono font-semibold'>{count}</span>
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button type='button' onClick={handleIncrement}>
            Increment Count
          </Button>
          <Button type='button' onClick={handleForceUpdate} variant='outline'>
            Force Re-render
          </Button>
        </div>

        <div className='text-muted-foreground text-xs'>
          <p>• Click "Increment Count" to change state and trigger re-render</p>
          <p>
            • Click "Force Re-render" to trigger re-render without changing
            state
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
