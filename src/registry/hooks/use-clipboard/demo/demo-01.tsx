'use client'
import { useId, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useClipboard } from '..'

export function Demo01() {
  const inputId = useId()
  const [inputValue, setInputValue] = useState('Hello, World!')
  const { text, copied, copy, isSupported } = useClipboard({
    source: inputValue,
    copiedDuring: 2000,
  })

  const handleCopy = async () => {
    await copy()
  }

  const handleCopyCustom = async () => {
    await copy('Custom text to copy')
  }

  if (!isSupported) {
    return (
      <div className='rounded-lg border border-destructive bg-destructive/10 p-4'>
        <p className='text-sm text-destructive'>
          Clipboard API is not supported in this browser.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium' htmlFor={inputId}>
          Text to copy
        </label>
        <Input
          id={inputId}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Enter text to copy'
        />
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button type='button' onClick={handleCopy} disabled={!inputValue}>
          {copied ? 'Copied!' : 'Copy from source'}
        </Button>
        <Button type='button' onClick={handleCopyCustom} variant='outline'>
          Copy custom text
        </Button>
      </div>

      <div className='space-y-2 rounded-lg border bg-muted/50 p-4'>
        <div className='text-sm'>
          <span className='font-medium'>Copied:</span>{' '}
          <span className={copied ? 'text-green-600' : 'text-muted-foreground'}>
            {copied ? 'Yes' : 'No'}
          </span>
        </div>
        <div className='text-sm'>
          <span className='font-medium'>Current clipboard text:</span>{' '}
          <span className='font-mono text-muted-foreground'>
            {text || '(empty)'}
          </span>
        </div>
      </div>
    </div>
  )
}
