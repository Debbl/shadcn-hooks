'use client'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
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
      <Card>
        <CardHeader>
          <CardTitle>Click Anywhere</CardTitle>
          <CardDescription>
            Click anywhere on the page to see the counter increase
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <p>
            Total clicks: <strong>{clickCount}</strong>
          </p>
          {lastClickPosition && (
            <p className='text-muted-foreground text-sm'>
              Last click position: ({lastClickPosition.x}, {lastClickPosition.y}
              )
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
