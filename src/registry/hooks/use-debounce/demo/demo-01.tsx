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
import { useDebounce } from '../index'

export function Demo01() {
  const [input, setInput] = useState('')
  const debouncedValue = useDebounce(input, 800)

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Debounce Demo</CardTitle>
        <CardDescription>
          Type in the input to see the debounced value update after 800ms
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type to debounce...'
        />
        <div className='text-muted-foreground space-y-1 text-sm'>
          <div>
            Input value: <span className='font-mono'>{input}</span>
          </div>
          <div>
            Debounced value: <span className='font-mono'>{debouncedValue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
