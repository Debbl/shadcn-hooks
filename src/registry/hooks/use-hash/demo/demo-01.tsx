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
import { useHash } from '..'

const PRESET_HASHES = ['intro', 'api', 'faq']

export function Demo01() {
  const hash = useHash()
  const [inputValue, setInputValue] = useState('demo-hash')

  const setHash = (value: string) => {
    const nextHash = value ? `#${value}` : ''
    window.location.assign(
      `${window.location.pathname}${window.location.search}${nextHash}`,
    )
  }

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>useHash Demo</CardTitle>
        <CardDescription>
          Update the URL hash and watch the hook value change in real time.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder='Type hash without #'
        />

        <div className='flex flex-wrap items-center gap-2'>
          <Button type='button' onClick={() => setHash(inputValue)}>
            Set hash
          </Button>
          <Button type='button' variant='outline' onClick={() => setHash('')}>
            Clear hash
          </Button>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          {PRESET_HASHES.map((item) => (
            <Button
              key={item}
              type='button'
              variant='secondary'
              onClick={() => setHash(item)}
            >
              #{item}
            </Button>
          ))}
        </div>

        <p className='text-muted-foreground text-sm'>
          Current hash:{' '}
          <span className='text-foreground font-mono'>{hash}</span>
        </p>
      </CardContent>
    </Card>
  )
}
