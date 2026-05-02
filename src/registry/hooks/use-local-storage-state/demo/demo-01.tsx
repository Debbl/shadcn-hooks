'use client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useLocalStorageState } from '..'

const DEMO_STORAGE_KEY = 'shadcn-hooks:demo:use-local-storage-state'

export function Demo01() {
  const [name, setName, clearName] = useLocalStorageState<string>(
    DEMO_STORAGE_KEY,
    '',
  )

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label htmlFor='local-storage-name' className='text-sm font-medium'>
          Persisted name
        </label>
        <Input
          id='local-storage-name'
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder='Type and refresh the page'
        />
      </div>

      <div className='flex items-center gap-2'>
        <Button type='button' variant='outline' onClick={() => setName('demo')}>
          Fill sample
        </Button>
        <Button type='button' variant='destructive' onClick={clearName}>
          Clear
        </Button>
      </div>

      <p className='text-muted-foreground text-sm'>
        Current value: <span className='font-mono'>{name || '(empty)'}</span>
      </p>
    </div>
  )
}
