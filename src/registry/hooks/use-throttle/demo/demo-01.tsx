'use client'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { useThrottle } from '../index'

export function Demo01() {
  const [input, setInput] = useState('')
  const throttledValue = useThrottle(input, 800)

  return (
    <Card className='ring-0'>
      <CardHeader>
        <CardTitle>Throttle Demo</CardTitle>
        <CardDescription>
          Type in the input to see the throttled value update at most once every
          800ms
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type to throttle...'
        />
        <div className='text-muted-foreground space-y-1 text-sm'>
          <div>
            Input value: <span className='font-mono'>{input}</span>
          </div>
          <div>
            Throttled value: <span className='font-mono'>{throttledValue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
