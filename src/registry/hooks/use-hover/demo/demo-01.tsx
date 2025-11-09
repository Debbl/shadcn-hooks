'use client'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { useHover } from '..'

export function Demo01() {
  const [hoverCount, setHoverCount] = useState(0)
  const [leaveCount, setLeaveCount] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const isButtonHovered = useHover(buttonRef, {
    onEnter: () => {
      setHoverCount((prev) => prev + 1)
    },
    onLeave: () => {
      setLeaveCount((prev) => prev + 1)
    },
  })

  const isCardHovered = useHover(cardRef)

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Button Hover</h3>
        <div className='space-y-2 rounded-lg border p-4'>
          <Button ref={buttonRef} type='button' variant='default'>
            Hover me!
          </Button>
          <div className='space-y-1 text-sm'>
            <p>
              Hover state: <strong>{isButtonHovered ? 'true' : 'false'}</strong>
            </p>
            <p className='text-muted-foreground'>
              Enter count: {hoverCount} | Leave count: {leaveCount}
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Card Hover</h3>
        <div
          ref={cardRef}
          className={`rounded-lg border p-6 transition-colors ${
            isCardHovered ? 'border-primary bg-primary/5' : 'bg-muted/50'
          }`}
        >
          <p className='font-medium'>Hover over this card</p>
          <p className='text-muted-foreground mt-2 text-sm'>
            Current hover state:{' '}
            <strong>{isCardHovered ? 'hovering' : 'not hovering'}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
