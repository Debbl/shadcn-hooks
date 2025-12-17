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
import { useDebounceFn } from '../index'

export function Demo01() {
  const [input, setInput] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')
  const [invokeCount, setInvokeCount] = useState(0)

  const { run, cancel, flush } = useDebounceFn((value: string) => {
    setDebouncedValue(value)
    setInvokeCount((c) => c + 1)
  }, 800)

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Debounce Function Demo</CardTitle>
        <CardDescription>
          Type in the input to see the debounced function execute after 800ms
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
          placeholder='Type to debounce...'
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
            Debounced value: <span className='font-mono'>{debouncedValue}</span>
          </div>
          <div>Invoke count: {invokeCount}</div>
        </div>
      </CardContent>
    </Card>
  )
}
