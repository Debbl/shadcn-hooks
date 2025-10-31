'use client'
import { useState } from 'react'
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
    <div className='space-y-3'>
      <input
        value={input}
        onChange={(e) => {
          const v = e.target.value
          setInput(v)
          run(v)
        }}
        placeholder='Type to throttle...'
        className='w-full rounded border p-2'
      />
      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={() => flush()}
          className='rounded border px-3 py-1'
        >
          Flush
        </button>
        <button
          type='button'
          onClick={() => cancel()}
          className='rounded border px-3 py-1'
        >
          Cancel
        </button>
      </div>
      <div className='text-muted-foreground text-sm'>
        <div>
          Throttled value: <span className='font-mono'>{throttledValue}</span>
        </div>
        <div>Invoke count: {invokeCount}</div>
      </div>
    </div>
  )
}
