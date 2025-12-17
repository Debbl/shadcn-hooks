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
import { Input } from '~/components/ui/input'
import { useThrottleFn } from '../index'

export function Demo01() {
  const [input, setInput] = useState('')
  const [throttledValue, setThrottledValue] = useState('')
  const [invokeCount, setInvokeCount] = useState(0)

  const { run, cancel, flush } = useThrottleFn((value: string) => {
    setThrottledValue(value)
    setInvokeCount((c) => c + 1)
  }, 800)

  return (
    <Card className='ring-0'>
      <CardHeader>
        <CardTitle>Throttle Function Demo</CardTitle>
        <CardDescription>
          Type in the input to see the throttled function execute at most once
          every 800ms
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Input
          value={input}
          onChange={(e) => {
            const v = e.target.value
            setInput(v)
            run(v)
          }}
          placeholder='Type to throttle...'
        />
        <div className='flex items-center gap-2'>
          <Button type='button' variant='outline' onClick={() => flush()}>
            Flush
          </Button>
          <Button type='button' variant='outline' onClick={() => cancel()}>
            Cancel
          </Button>
        </div>
        <div className='text-muted-foreground space-y-1 text-sm'>
          <div>
            Throttled value: <span className='font-mono'>{throttledValue}</span>
          </div>
          <div>Invoke count: {invokeCount}</div>
        </div>
      </CardContent>
    </Card>
  )
}
