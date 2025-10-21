'use client'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { useCustomCompareEffect } from '..'

interface User {
  id: number
  name: string
  age: number
}

export function Demo01() {
  const [user, setUser] = useState<User>({ id: 1, name: 'John', age: 30 })
  const [effectCount, setEffectCount] = useState(0)
  const [log, setLog] = useState<string[]>([])

  // Custom compare function: only compare id property
  const compareById = (a: User[], b: User[]) => {
    const result = a[0]?.id === b[0]?.id
    setLog((prev) => [
      ...prev,
      `Compare: id=${a[0]?.id} vs id=${b[0]?.id}, result: ${result}`,
    ])
    return result
  }

  // Use useCustomCompareEffect, only compare id
  useCustomCompareEffect(
    () => {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setEffectCount((prev) => prev + 1)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setLog((prev) => [
        ...prev,
        `Effect executed! Current user: ${JSON.stringify(user)}`,
      ])
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
    setLog([])
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-lg border bg-gray-50 p-4'>
        <h3 className='mb-2 font-semibold'>Current User Info</h3>
        <p>ID: {user.id}</p>
        <p>Name: {user.name}</p>
        <p>Age: {user.age}</p>
        <p className='mt-2 text-sm text-gray-600'>
          Effect execution count: {effectCount}
        </p>
      </div>

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

      <div className='rounded-lg border p-4'>
        <h3 className='mb-2 font-semibold'>Comparison Log</h3>
        <div className='max-h-40 space-y-1 overflow-y-auto text-sm'>
          {log.length === 0 ? (
            <p className='text-gray-500'>No logs yet</p>
          ) : (
            log.map((entry, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`log-${index}-${entry.slice(0, 10)}`}
                className='rounded bg-white p-1 font-mono text-xs'
              >
                {entry}
              </div>
            ))
          )}
        </div>
      </div>

      <div className='text-sm text-gray-600'>
        <p>
          <strong>Description:</strong>
        </p>
        <ul className='list-inside list-disc space-y-1'>
          <li>
            This demo uses a custom compare function that only compares the user
            ID
          </li>
          <li>
            Changing name or age won't trigger the effect (because ID hasn't
            changed)
          </li>
          <li>Only changing the ID will trigger the effect</li>
          <li>Check the log to understand the comparison process</li>
        </ul>
      </div>
    </div>
  )
}
