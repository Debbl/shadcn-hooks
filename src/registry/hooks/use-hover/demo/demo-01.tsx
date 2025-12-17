'use client'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
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
      <Card>
        <CardHeader>
          <CardTitle>Button Hover</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
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
        </CardContent>
      </Card>

      <Card
        ref={cardRef}
        className={`transition-colors ${
          isCardHovered ? 'border-primary bg-primary/5' : ''
        }`}
      >
        <CardHeader>
          <CardTitle>Card Hover</CardTitle>
          <CardDescription>Hover over this card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            Current hover state:{' '}
            <strong>{isCardHovered ? 'hovering' : 'not hovering'}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
