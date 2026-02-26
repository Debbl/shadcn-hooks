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
import { useTitle } from '..'

export function Demo01() {
  const [inputValue, setInputValue] = useState('Shadcn Hooks')
  const [title, setTitle] = useTitle('Shadcn Hooks', {
    observe: true,
  })

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>useTitle Demo</CardTitle>
        <CardDescription>
          Update document.title from the hook or simulate external updates.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder='Type a title...'
        />

        <div className='flex flex-wrap items-center gap-2'>
          <Button
            type='button'
            onClick={() => setTitle(inputValue || 'Untitled')}
          >
            Set from hook
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              document.title = 'External Title'
            }}
          >
            Set external title
          </Button>
        </div>

        <p className='text-muted-foreground text-sm'>
          Current hook value:{' '}
          <span className='text-foreground font-medium'>{title}</span>
        </p>
      </CardContent>
    </Card>
  )
}
