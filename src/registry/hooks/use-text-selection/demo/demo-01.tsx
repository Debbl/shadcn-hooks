'use client'

import { useRef } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useTextSelection } from '..'

const sampleText = `Try selecting some text in this paragraph. The hook will track the selected text and its position (top, left, width, height) on the page. You can use this to build tooltips, highlight menus, or copy buttons that appear near the selection.`

export function Demo01() {
  const ref = useRef<HTMLDivElement>(null)
  const selection = useTextSelection(ref)

  const hasSelection = selection.text.length > 0
  const hasValidRect = !Number.isNaN(selection.width) && selection.width > 0

  return (
    <div className='space-y-6'>
      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>Text Selection</CardTitle>
          <CardDescription>
            Select text in the box below to see the selection state and bounding
            rect
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div
            ref={ref}
            className='border-border bg-muted/30 selection:bg-primary/20 selection:text-primary-foreground rounded-lg border px-4 py-3 text-sm leading-relaxed'
          >
            {sampleText}
          </div>

          <div className='border-border bg-muted/20 space-y-2 rounded-lg border border-dashed p-4 text-sm'>
            <p className='font-medium'>Selection state:</p>
            <dl className='text-muted-foreground grid gap-1.5'>
              <div className='flex gap-2'>
                <dt className='min-w-16'>text:</dt>
                <dd className='font-mono'>
                  {hasSelection ? `"${selection.text}"` : '(none)'}
                </dd>
              </div>
              {hasValidRect && (
                <>
                  <div className='flex gap-2'>
                    <dt className='min-w-16'>top:</dt>
                    <dd>{Math.round(selection.top)}</dd>
                  </div>
                  <div className='flex gap-2'>
                    <dt className='min-w-16'>left:</dt>
                    <dd>{Math.round(selection.left)}</dd>
                  </div>
                  <div className='flex gap-2'>
                    <dt className='min-w-16'>width:</dt>
                    <dd>{Math.round(selection.width)}</dd>
                  </div>
                  <div className='flex gap-2'>
                    <dt className='min-w-16'>height:</dt>
                    <dd>{Math.round(selection.height)}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
