'use client'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useCounter } from '..'

export function Demo01() {
  const [count, { inc, dec, reset }] = useCounter(0)

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Counter Demo</CardTitle>
        <CardDescription>
          A simple counter with increment, decrement, and reset functionality
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-lg font-semibold'>Count: {count}</p>

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
      </CardContent>
    </Card>
  )
}
