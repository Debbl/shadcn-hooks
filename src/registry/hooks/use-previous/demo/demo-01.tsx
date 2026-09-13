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
import usePrevious from '..'

export function Demo01() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Previous Value Demo</CardTitle>
        <CardDescription>
          Track the previous value of a state variable
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <p className='text-sm text-muted-foreground'>
            Current count:{' '}
            <span className='font-medium text-foreground'>{count}</span>
          </p>
          <p className='text-sm text-muted-foreground'>
            Previous count:{' '}
            <span className='font-medium text-foreground'>
              {previousCount !== undefined
                ? previousCount
                : 'undefined (initial render)'}
            </span>
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button type='button' onClick={() => setCount((c) => c + 1)}>
            Increment +
          </Button>
          <Button type='button' onClick={() => setCount((c) => c - 1)}>
            Decrement -
          </Button>
          <Button type='button' variant='outline' onClick={() => setCount(0)}>
            Reset to 0
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
