'use client'
import { useState } from 'react'
import { useThrottle } from '../index'

export function Demo01() {
  const [input, setInput] = useState('')
  const throttledValue = useThrottle(input, 800)

  return (
    <div className='space-y-3'>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Type to throttle...'
        className='w-full rounded border p-2'
      />
      <div className='text-muted-foreground text-sm'>
        <div>
          Input value: <span className='font-mono'>{input}</span>
        </div>
        <div>
          Throttled value: <span className='font-mono'>{throttledValue}</span>
        </div>
      </div>
    </div>
  )
}
