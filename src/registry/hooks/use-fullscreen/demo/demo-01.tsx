'use client'
import { useRef } from 'react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useFullscreen } from '..'

export function Demo01() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isSupported, isFullscreen, enter, exit, toggle } =
    useFullscreen(containerRef)

  return (
    <div className='space-y-4'>
      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>useFullscreen Demo</CardTitle>
          <CardDescription>
            A hook to manage fullscreen state for any element
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Status Display */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>Fullscreen Status</p>
              <div className='flex items-center gap-2'>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isFullscreen
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {isFullscreen ? 'Fullscreen' : 'Normal'}
                </span>
                {!isSupported && (
                  <span className='inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200'>
                    Not Supported
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Controls</p>
            <div className='flex flex-wrap items-center gap-2'>
              <Button
                type='button'
                onClick={enter}
                disabled={!isSupported || isFullscreen}
              >
                Enter Fullscreen
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={exit}
                disabled={!isSupported || !isFullscreen}
              >
                Exit Fullscreen
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={toggle}
                disabled={!isSupported}
              >
                Toggle Fullscreen
              </Button>
            </div>
          </div>

          {/* Target Element */}
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Target Element</p>
            <div
              ref={containerRef}
              className='relative flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900'
            >
              <div className='space-y-4 text-center'>
                <div className='bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='32'
                    height='32'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-primary'
                  >
                    <path d='M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3' />
                  </svg>
                </div>
                <div>
                  <h3 className='text-lg font-semibold'>
                    Fullscreen Container
                  </h3>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    This element will be displayed in fullscreen mode when you
                    click the buttons above
                  </p>
                  {isFullscreen && (
                    <p className='mt-2 text-sm font-medium text-green-600 dark:text-green-400'>
                      ✓ Currently in fullscreen mode
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          {!isSupported && (
            <div className='rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20'>
              <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                ⚠️ Fullscreen API is not supported in this browser. Please use a
                modern browser that supports the Fullscreen API.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
