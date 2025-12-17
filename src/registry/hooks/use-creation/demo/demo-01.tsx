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
    [count],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creation Demo</CardTitle>
        <CardDescription>
          User object ID changes only when count changes (not when name changes)
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <p className='text-muted-foreground text-sm'>
            <span>User object: </span>
          </p>
          <code className='text-foreground bg-muted block rounded p-2 font-mono text-xs font-medium'>
            {JSON.stringify(user, null, 2)}
          </code>
          <div className='space-y-1 text-sm'>
            <p className='text-muted-foreground'>
              Created at:{' '}
              <span className='text-foreground font-mono text-xs font-medium'>
                {user.createdAt}
              </span>
            </p>
            <p className='text-muted-foreground'>
              Name: <span className='text-foreground font-medium'>{name}</span>
            </p>
            <p className='text-muted-foreground'>
              Count:{' '}
              <span className='text-foreground font-medium'>{count}</span>
            </p>
          </div>
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
      </CardContent>
    </Card>
  )
}
