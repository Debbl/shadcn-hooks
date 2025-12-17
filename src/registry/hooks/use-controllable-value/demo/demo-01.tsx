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
import { useControllableValue } from '..'

function ControlledInput() {
  const [value, setValue] = useState('Controlled Input')
  const [inputValue, setInputValue] = useControllableValue({
    value,
    onChange: setValue,
  })

  return (
    <Card className='ring-0'>
      <CardHeader>
        <CardTitle>Controlled Mode</CardTitle>
        <CardDescription>
          The value is controlled by parent state
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className='max-w-xs'
          />
          <Button
            type='button'
            variant='outline'
            onClick={() => setInputValue('Reset')}
          >
            Reset
          </Button>
        </div>
        <p className='text-muted-foreground text-xs'>
          Parent state: <code className='font-mono'>{value}</code>
        </p>
      </CardContent>
    </Card>
  )
}

function UncontrolledInput() {
  const [inputValue, setInputValue] = useControllableValue({
    defaultValue: 'Uncontrolled Input',
  })

  return (
    <Card className='ring-0'>
      <CardHeader>
        <CardTitle>Uncontrolled Mode</CardTitle>
        <CardDescription>The value is managed internally</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className='max-w-xs'
          />
          <Button
            type='button'
            variant='outline'
            onClick={() => setInputValue('Reset')}
          >
            Reset
          </Button>
        </div>
        <p className='text-muted-foreground text-xs'>
          Internal state: <code className='font-mono'>{inputValue}</code>
        </p>
      </CardContent>
    </Card>
  )
}

function CounterExample() {
  const [count, setCount] = useControllableValue<number>({ defaultValue: 0 })

  return (
    <Card className='ring-0'>
      <CardHeader>
        <CardTitle>Counter Example</CardTitle>
        <CardDescription>Using function updater pattern</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setCount((prev) => prev - 1)}
          >
            Decrement -
          </Button>
          <span className='min-w-12 text-center font-mono text-lg font-semibold'>
            {count}
          </span>
          <Button
            type='button'
            variant='outline'
            onClick={() => setCount((prev) => prev + 1)}
          >
            Increment +
          </Button>
          <Button type='button' variant='outline' onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function Demo01() {
  return (
    <div className='space-y-4'>
      <Card className='ring-0'>
        <CardHeader>
          <CardTitle>useControllableValue</CardTitle>
          <CardDescription>
            A hook to manage a value that can be either controlled or
            uncontrolled. This is useful for building components that work in
            both modes, similar to React&apos;s built-in components like input.
          </CardDescription>
        </CardHeader>
      </Card>

      <ControlledInput />
      <UncontrolledInput />
      <CounterExample />
    </div>
  )
}
