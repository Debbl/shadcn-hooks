'use client'
import { useRef } from 'react'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useScroll } from '..'

const demoItems = Array.from({ length: 30 }, (_, index) => index + 1)

export function Demo01() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { x, y, isScrolling, directions, arrivedState } = useScroll(
    containerRef,
    { idle: 300 },
  )

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Scroll Tracker</CardTitle>
        <CardDescription>
          Scroll inside the box below to see reactive scroll state
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div
          ref={containerRef}
          className='bg-muted h-48 overflow-auto rounded-md'
        >
          <div className='h-150 w-200 p-4'>
            <p className='text-muted-foreground text-sm'>
              Scroll horizontally and vertically to explore the state below.
            </p>
            <div className='mt-4 grid grid-cols-3 gap-4'>
              {demoItems.map((item) => (
                <div
                  key={item}
                  className='bg-background flex h-16 w-24 items-center justify-center rounded border text-xs'
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3 text-sm'>
          <div>
            <p className='text-muted-foreground'>X</p>
            <p className='font-mono text-lg'>{Math.round(x)}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Y</p>
            <p className='font-mono text-lg'>{Math.round(y)}</p>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2 text-sm'>
          <span className='text-muted-foreground'>Status</span>
          <Badge variant={isScrolling ? 'default' : 'secondary'}>
            {isScrolling ? 'scrolling' : 'idle'}
          </Badge>
        </div>

        <div className='space-y-1 text-sm'>
          <p className='text-muted-foreground'>Direction</p>
          <div className='flex flex-wrap gap-2'>
            {(['up', 'down', 'left', 'right'] as const).map((dir) => (
              <Badge
                key={dir}
                variant={directions[dir] ? 'default' : 'outline'}
              >
                {dir}
              </Badge>
            ))}
          </div>
        </div>

        <div className='space-y-1 text-sm'>
          <p className='text-muted-foreground'>Arrived at</p>
          <div className='flex flex-wrap gap-2'>
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Badge
                key={side}
                variant={arrivedState[side] ? 'default' : 'outline'}
              >
                {side}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
