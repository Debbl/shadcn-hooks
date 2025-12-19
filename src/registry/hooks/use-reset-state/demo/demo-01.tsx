'use client'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useResetState } from '..'

export function Demo01() {
  const [count, setCount, resetCount] = useResetState(0)
  const [name, setName, resetName] = useResetState('John Doe')
  const [user, setUser, resetUser] = useResetState(() => ({
    id: 1,
    name: 'Alice',
    age: 25,
  }))

  return (
    <div className='space-y-4'>
      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>useResetState Demo</CardTitle>
          <CardDescription>
            A hook that provides a reset function to restore state to its
            initial value
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Counter Example */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>Counter</p>
              <p className='text-lg font-semibold'>Count: {count}</p>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setCount((prev) => prev - 1)}
              >
                Decrement -
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => setCount((prev) => prev + 1)}
              >
                Increment +
              </Button>
              <Button type='button' onClick={() => setCount(10)}>
                Set to 10
              </Button>
              <Button type='button' variant='destructive' onClick={resetCount}>
                Reset to 0
              </Button>
            </div>
          </div>

          {/* Name Example */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>Name</p>
              <p className='text-lg font-semibold'>Name: {name}</p>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setName('Jane Smith')}
              >
                Set to "Jane Smith"
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => setName('Bob Johnson')}
              >
                Set to "Bob Johnson"
              </Button>
              <Button type='button' variant='destructive' onClick={resetName}>
                Reset to "John Doe"
              </Button>
            </div>
          </div>

          {/* Object Example */}
          <div className='space-y-2'>
            <div className='space-y-1'>
              <p className='text-sm font-medium'>User Object</p>
              <div className='bg-muted rounded-md p-3 text-sm'>
                <p>ID: {user.id}</p>
                <p>Name: {user.name}</p>
                <p>Age: {user.age}</p>
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() =>
                  setUser((prev) => ({ ...prev, name: 'Bob', age: 30 }))
                }
              >
                Update Name & Age
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() =>
                  setUser((prev) => ({ ...prev, id: prev.id + 1 }))
                }
              >
                Increment ID
              </Button>
              <Button type='button' variant='destructive' onClick={resetUser}>
                Reset User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
