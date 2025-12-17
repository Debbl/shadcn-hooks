/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
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
import { useDebounceEffect } from '../index'

export function Demo01() {
  const [input, setInput] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')
  const [invokeCount, setInvokeCount] = useState(0)

  useDebounceEffect(
    () => {
      setDebouncedValue(input)
      setInvokeCount((c) => c + 1)
    },
    [input],
    800,
  )

  return (
    <Card className='ring-0'>
      <CardHeader>
        <CardTitle>Debounce Effect Demo</CardTitle>
        <CardDescription>
          Type in the input to see the debounced effect execute after 800ms
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Input
          value={input}
          onChange={(e) => {
            const v = e.target.value
            setInput(v)
          }}
          placeholder='Type to debounce...'
        />
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
