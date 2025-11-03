/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
'use client'
import { useState } from 'react'
import { useThrottleEffect } from '../index'

export function Demo01() {
  const [input, setInput] = useState('')
  const [throttledValue, setThrottledValue] = useState('')
  const [invokeCount, setInvokeCount] = useState(0)

  useThrottleEffect(
    () => {
      setThrottledValue(input)
      setInvokeCount((c) => c + 1)
    },
    [input],
    800,
  )

  return (
    <div className='space-y-3'>
      <input
        value={input}
        onChange={(e) => {
          const v = e.target.value
          setInput(v)
        }}
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
        <div>Invoke count: {invokeCount}</div>
      </div>
    </div>
  )
}
