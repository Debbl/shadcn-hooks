'use client'
import { useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { useElementSize } from '..'

function toDimension(value: string, min: number) {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    return min
  }

  return Math.max(min, parsed)
}

export function Demo01() {
  const targetRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(280)
  const [height, setHeight] = useState(160)
  const size = useElementSize(targetRef)

  return (
    <div className='space-y-6'>
      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>Element size</CardTitle>
          <CardDescription>
            Current size: {Math.round(size.width)}px × {Math.round(size.height)}
            px
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2'>
          <label className='space-y-2 text-sm'>
            Width (px)
            <Input
              type='number'
              min={120}
              value={width}
              onChange={(event) => {
                setWidth(toDimension(event.target.value, 120))
              }}
            />
          </label>
          <label className='space-y-2 text-sm'>
            Height (px)
            <Input
              type='number'
              min={100}
              value={height}
              onChange={(event) => {
                setHeight(toDimension(event.target.value, 100))
              }}
            />
          </label>
        </CardContent>
      </Card>

      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>Resize target</CardTitle>
          <CardDescription>
            Use the inputs above or drag the resize handle in the bottom-right
            corner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={targetRef}
            style={{ width, height }}
            className='bg-muted/30 resize overflow-auto rounded-md border p-4 text-sm'
          >
            Resize me to see <code>useElementSize</code> update in real time.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
