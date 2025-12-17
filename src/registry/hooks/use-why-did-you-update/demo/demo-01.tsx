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
import { useWhyDidYouUpdate } from '..'

function DemoComponent({
  name,
  count,
  active,
}: {
  name: string
  count: number
  active: boolean
}) {
  useWhyDidYouUpdate('DemoComponent', { name, count, active })

  return (
    <Card className='ring-0'>
      <CardContent className='pt-6'>
        <div className='space-y-2 text-sm'>
          <p>
            <span className='text-muted-foreground'>Name:</span>{' '}
            <span className='font-medium'>{name}</span>
          </p>
          <p>
            <span className='text-muted-foreground'>Count:</span>{' '}
            <span className='font-medium'>{count}</span>
          </p>
          <p>
            <span className='text-muted-foreground'>Active:</span>{' '}
            <span className='font-medium'>{active ? 'true' : 'false'}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function Demo01() {
  const [name, setName] = useState('Test Component')
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(false)

  return (
    <div className='space-y-4'>
      <Card className='ring-0'>
        <CardHeader>
          <CardTitle>Why Did You Update</CardTitle>
          <CardDescription>
            Open your browser console to see the prop changes logged when you
            interact with the buttons below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DemoComponent name={name} count={count} active={active} />
        </CardContent>
      </Card>

      <Card className='ring-0'>
        <CardContent className='pt-6'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() =>
                  setName((n) =>
                    n === 'Test Component'
                      ? 'Updated Component'
                      : 'Test Component',
                  )
                }
              >
                Change Name
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => setCount((c) => c + 1)}
              >
                Increment Count
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => setActive((a) => !a)}
              >
                Toggle Active
              </Button>
            </div>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                setName('Test Component')
                setCount(0)
                setActive(false)
              }}
            >
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
