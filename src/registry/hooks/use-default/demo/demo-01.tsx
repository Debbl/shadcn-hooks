'use client'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useDefault } from '..'

export function Demo01() {
  const [name, setName] = useDefault<string>(undefined, 'Guest')

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>useDefault Demo</CardTitle>
        <CardDescription>
          Shows fallback output when state is null or undefined
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-lg font-semibold'>Current name: {name}</p>
        <div className='flex flex-wrap items-center gap-2'>
          <Button type='button' onClick={() => setName('Alice')}>
            Set "Alice"
          </Button>
          <Button type='button' onClick={() => setName('Bob')}>
            Set "Bob"
          </Button>
          <Button type='button' variant='outline' onClick={() => setName(null)}>
            Set null
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => setName(undefined)}
          >
            Set undefined
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
