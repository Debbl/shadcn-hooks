'use client'
import { useRef, useState } from 'react'
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
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Basic Usage</h3>
        <div className='space-y-2 rounded-lg border p-4'>
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
        </div>
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Scroll to see the target</h3>
        <div className='h-96 overflow-y-auto rounded-lg border p-4'>
          <div className='h-64' />
          <div
            ref={targetRef}
            className={`rounded-lg border p-6 transition-colors ${
              isInViewport
                ? 'border-primary bg-primary/5'
                : 'bg-muted/50 border-muted'
            }`}
          >
            <p className='font-medium'>Target Element</p>
            <p className='text-muted-foreground mt-2 text-sm'>
              Scroll this element into and out of view to see the hook in
              action.
            </p>
          </div>
          <div className='h-64' />
        </div>
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>With Threshold (50%)</h3>
        <div className='space-y-2 rounded-lg border p-4'>
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
            <p className='text-muted-foreground'>
              This example requires 50% of the element to be visible before
              considering it in viewport.
            </p>
          </div>
        </div>
        <div className='h-64 overflow-y-auto rounded-lg border p-4'>
          <div className='h-32' />
          <div
            ref={thresholdTargetRef}
            className={`rounded-lg border p-6 transition-colors ${
              isInViewportWithThreshold
                ? 'border-primary bg-primary/5'
                : 'bg-muted/50 border-muted'
            }`}
          >
            <p className='font-medium'>50% Threshold Example</p>
            <p className='text-muted-foreground mt-2 text-sm'>
              Scroll this element. It will only be considered "in viewport" when
              at least 50% is visible.
            </p>
          </div>
          <div className='h-32' />
        </div>
      </div>
    </div>
  )
}
