'use client'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { useCreation } from '..'

export function Demo01() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Alice')

  // useCreation will only recreate the object when dependencies change
  const user = useCreation(
    () => ({
      id: Math.random(),
      name,
      count,
      createdAt: new Date().toISOString(),
    }),
    [name, count],
  )

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          User object ID (changes only when name or count changes):{' '}
          <span className='text-foreground font-mono text-xs font-medium'>
            {user.id}
          </span>
        </p>
        <p className='text-muted-foreground text-sm'>
          Created at:{' '}
          <span className='text-foreground font-mono text-xs font-medium'>
            {user.createdAt}
          </span>
        </p>
        <p className='text-muted-foreground text-sm'>
          Name: <span className='text-foreground font-medium'>{user.name}</span>
        </p>
        <p className='text-muted-foreground text-sm'>
          Count:{' '}
          <span className='text-foreground font-medium'>{user.count}</span>
        </p>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <Button type='button' onClick={() => setCount((c) => c + 1)}>
            Increment Count
          </Button>
          <Button type='button' variant='outline' onClick={() => setCount(0)}>
            Reset Count
          </Button>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            onClick={() => setName((n) => (n === 'Alice' ? 'Bob' : 'Alice'))}
          >
            Toggle Name
          </Button>
        </div>
      </div>
    </div>
  )
}
