'use client'
import { Button } from '~/components/ui/button'
import { useBoolean } from '..'

export function Demo01() {
  const [value, { setTrue, setFalse, toggle }] = useBoolean(false)

  return (
    <div>
      <p>Value: {value ? 'true' : 'false'}</p>

      <div className='flex items-center gap-2'>
        <Button type='button' onClick={setTrue}>
          Set True
        </Button>
        <Button type='button' onClick={setFalse}>
          Set False
        </Button>
        <Button type='button' onClick={toggle}>
          Toggle {value ? 'false' : 'true'}
        </Button>
      </div>
    </div>
  )
}
