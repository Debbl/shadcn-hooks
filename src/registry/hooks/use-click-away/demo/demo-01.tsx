'use client'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { useClickAway } from '..'

export function Demo01() {
  const [isOpen, setIsOpen] = useState(false)
  const [clickAwayCount, setClickAwayCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickAway(() => {
    setIsOpen(false)
    setClickAwayCount((prev) => prev + 1)
  }, containerRef)

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Click Away Demo</h3>
        <p className='text-muted-foreground text-sm'>
          Click the button to open the dropdown, then click outside to close it.
        </p>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center gap-4'>
          <div ref={containerRef} className='relative inline-block'>
            <Button
              type='button'
              onClick={() => setIsOpen(!isOpen)}
              variant={isOpen ? 'default' : 'outline'}
            >
              {isOpen ? 'Close Menu' : 'Open Menu'}
            </Button>

            {isOpen && (
              <div className='bg-popover absolute top-full left-0 z-100 mt-2 w-32 rounded-lg border p-2 shadow-md'>
                <div className='space-y-1'>
                  <p className='font-medium'>Menu Items</p>
                  <button
                    type='button'
                    className='hover:bg-accent block w-full rounded px-2 py-1 text-left text-sm'
                    onClick={() => setIsOpen(false)}
                  >
                    Item 1
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='space-y-2 rounded-lg border p-4'>
          <p className='text-sm'>
            Menu is: <strong>{isOpen ? 'Open' : 'Closed'}</strong>
          </p>
          <p className='text-muted-foreground text-sm'>
            Click away count: <strong>{clickAwayCount}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
