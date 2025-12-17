'use client'
import { useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useInViewport } from '..'

export function Demo01() {
  const [callbackCount, setCallbackCount] = useState(0)
  const targetRef = useRef<HTMLDivElement>(null)
  const [isInViewport, ratio] = useInViewport(targetRef, {
    callback: () => {
      setCallbackCount((prev) => prev + 1)
    },
  })

  const thresholdTargetRef = useRef<HTMLDivElement>(null)
  const [isInViewportWithThreshold] = useInViewport(thresholdTargetRef, {
    threshold: 0.5,
  })

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Basic Usage</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='space-y-1 text-sm'>
            <p>
              In viewport:{' '}
              <strong>
                {isInViewport === undefined
                  ? 'undefined'
                  : isInViewport
                    ? 'true'
                    : 'false'}
              </strong>
            </p>
            <p>
              Intersection ratio:{' '}
              <strong>
                {ratio === undefined ? 'undefined' : ratio.toFixed(2)}
              </strong>
            </p>
            <p className='text-muted-foreground'>
              Callback called: {callbackCount} times
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scroll to see the target</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[300px] rounded-lg border p-4'>
            <div className='text-muted-foreground flex h-[400px] items-center justify-center text-sm'>
              Scroll down to see the target element
            </div>
            <Card
              ref={targetRef}
              className={`transition-colors ${
                isInViewport ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader>
                <CardTitle>Target Element</CardTitle>
                <CardDescription>
                  Scroll this element into and out of view to see the hook in
                  action.
                </CardDescription>
              </CardHeader>
            </Card>
            <div className='text-muted-foreground flex h-[400px] items-center justify-center text-sm'>
              Scroll up to see the target element again
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Threshold (50%)</CardTitle>
          <CardDescription>
            This example requires 50% of the element to be visible before
            considering it in viewport.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1 text-sm'>
            <p>
              In viewport (50% threshold):{' '}
              <strong>
                {isInViewportWithThreshold === undefined
                  ? 'undefined'
                  : isInViewportWithThreshold
                    ? 'true'
                    : 'false'}
              </strong>
            </p>
          </div>
          <ScrollArea className='h-[300px] rounded-lg border p-4'>
            <div className='text-muted-foreground flex h-[300px] items-center justify-center text-sm'>
              Scroll down to see the threshold example
            </div>
            <Card
              ref={thresholdTargetRef}
              className={`transition-colors ${
                isInViewportWithThreshold ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader>
                <CardTitle>50% Threshold Example</CardTitle>
                <CardDescription>
                  Scroll this element. It will only be considered "in viewport"
                  when at least 50% is visible.
                </CardDescription>
              </CardHeader>
            </Card>
            <div className='text-muted-foreground flex h-[300px] items-center justify-center text-sm'>
              Scroll up to see the threshold example again
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
