'use client'
import { Button } from '~/components/ui/button'
import { useCounter } from '..'

export function Demo01() {
  const [count, { inc, dec, reset }] = useCounter(0)

  return (
    <div>
      <p>Count: {count}</p>

      <div className='flex items-center gap-2'>
        <Button type='button' onClick={inc}>
          Increment +
        </Button>
        <Button type='button' onClick={dec}>
          Decrement -
        </Button>
        <Button type='button' onClick={reset}>
          Reset to 0
        </Button>
      </div>
    </div>
  )
}
