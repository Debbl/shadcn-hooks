'use client'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useControllableValue } from '..'

function ControlledInput() {
  const [value, setValue] = useState('Controlled Input')
  const [inputValue, setInputValue] = useControllableValue({
    value,
    onChange: setValue,
  })

  return (
    <div className='space-y-2 rounded-lg border p-4'>
      <div className='space-y-1'>
        <p className='text-sm font-medium'>Controlled Mode</p>
        <p className='text-muted-foreground text-xs'>
          The value is controlled by parent state
        </p>
      </div>
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
    </div>
  )
}

function UncontrolledInput() {
  const [inputValue, setInputValue] = useControllableValue({
    defaultValue: 'Uncontrolled Input',
  })

  return (
    <div className='space-y-2 rounded-lg border p-4'>
      <div className='space-y-1'>
        <p className='text-sm font-medium'>Uncontrolled Mode</p>
        <p className='text-muted-foreground text-xs'>
          The value is managed internally
        </p>
      </div>
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
    </div>
  )
}

function CounterExample() {
  const [count, setCount] = useControllableValue<number>({ defaultValue: 0 })

  return (
    <div className='space-y-2 rounded-lg border p-4'>
      <div className='space-y-1'>
        <p className='text-sm font-medium'>Counter Example</p>
        <p className='text-muted-foreground text-xs'>
          Using function updater pattern
        </p>
      </div>
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
    </div>
  )
}

export function Demo01() {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>useControllableValue</h3>
        <p className='text-muted-foreground text-sm'>
          A hook to manage a value that can be either controlled or
          uncontrolled. This is useful for building components that work in both
          modes, similar to React&apos;s built-in components like input.
        </p>
      </div>

      <ControlledInput />
      <UncontrolledInput />
      <CounterExample />
    </div>
  )
}
