'use client'
import { useState } from 'react'
import { useClickAnyWhere } from '..'

export function Demo01() {
  const [clickCount, setClickCount] = useState(0)
  const [lastClickPosition, setLastClickPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  useClickAnyWhere((event) => {
    setClickCount((prev) => prev + 1)
    setLastClickPosition({
      x: event.clientX,
      y: event.clientY,
    })
  })

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Click Anywhere</h3>
        <div className='space-y-2 rounded-lg border p-4'>
          <p className='text-sm'>
            Click anywhere on the page to see the counter increase
          </p>
          <div className='space-y-2'>
            <p>
              Total clicks: <strong>{clickCount}</strong>
            </p>
            {lastClickPosition && (
              <p className='text-muted-foreground text-sm'>
                Last click position: ({lastClickPosition.x},{' '}
                {lastClickPosition.y})
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
