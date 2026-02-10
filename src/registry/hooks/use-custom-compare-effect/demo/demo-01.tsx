'use client'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useUpdate } from '~/registry/hooks/use-update'
import { useCustomCompareEffect } from '..'

interface User {
  id: number
  name: string
  age: number
}

export function Demo01() {
  const [user, setUser] = useState<User>({ id: 1, name: 'John', age: 30 })
  const [effectCount, setEffectCount] = useState(0)
  const log = useRef<string[]>([])
  const forceUpdate = useUpdate()

  // Custom compare function: only compare id property
  const compareById = (a: User[], b: User[]) => {
    const result = a[0]?.id === b[0]?.id
    log.current.push(
      `Compare: id=${a[0]?.id} vs id=${b[0]?.id}, result: ${result}`,
    )
    return result
  }

  // Use useCustomCompareEffect, only compare id
  useCustomCompareEffect(
    () => {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setEffectCount((prev) => prev + 1)

      log.current.push(`Effect executed! Current user: ${JSON.stringify(user)}`)
    },
    [user],
    compareById,
  )

  const updateName = () => {
    setUser((prev) => ({
      ...prev,
      name: prev.name === 'John' ? 'Jane' : 'John',
    }))
  }

  const updateAge = () => {
    setUser((prev) => ({ ...prev, age: prev.age + 1 }))
  }

  const updateId = () => {
    setUser((prev) => ({ ...prev, id: prev.id + 1 }))
  }

  const reset = () => {
    setUser({ id: 1, name: 'John', age: 30 })
    setEffectCount(0)
    log.current = []
  }

  return (
    <div className='space-y-4'>
      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>Current User Info</CardTitle>
          <CardDescription>
            Effect only executes when ID changes (not when name or age changes)
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Age: {user.age}</p>
          <p className='text-muted-foreground mt-2 text-sm'>
            Effect execution count: {effectCount}
          </p>
        </CardContent>
      </Card>

      <div className='flex flex-wrap gap-2'>
        <Button onClick={updateName}>
          Change Name ({user.name === 'John' ? 'John → Jane' : 'Jane → John'})
        </Button>
        <Button onClick={updateAge}>Increase Age (+1)</Button>
        <Button onClick={updateId}>Change ID (+1)</Button>
        <Button onClick={reset} variant='outline'>
          Reset
        </Button>
      </div>

      <Card className='shadow-none ring-0'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Comparison Log</CardTitle>
            <Button onClick={forceUpdate} variant='outline' size='sm'>
              Refresh Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-40 max-h-40'>
            <div className='space-y-1 py-1 text-sm'>
              {/* eslint-disable-next-line react-hooks/refs */}
              {log.current.length === 0 ? (
                <p className='text-foreground'>No logs yet</p>
              ) : (
                // eslint-disable-next-line react-hooks/refs
                log.current.toReversed().map((entry, index) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`log-${index}-${entry.slice(0, 10)}`}
                    className='bg-muted rounded p-1 font-mono text-xs'
                  >
                    {entry}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
