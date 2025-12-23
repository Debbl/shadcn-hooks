'use client'
import { FullscreenIcon, MonitorIcon } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { useFullscreen } from '..'

export function Demo01() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isSupported, isFullscreen, enter, exit, toggle } =
    useFullscreen(containerRef)

  // Page-level fullscreen (no target = document.documentElement)
  const {
    isSupported: isPageSupported,
    isFullscreen: isPageFullscreen,
    enter: enterPage,
    exit: exitPage,
    toggle: togglePage,
  } = useFullscreen()

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
              className='relative flex min-h-50 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900'
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
                  <Button
                    variant='outline'
                    size='icon'
                    className='mt-2'
                    onClick={() => {
                      if (!isFullscreen) {
                        enter()
                      } else {
                        exit()
                      }
                    }}
                  >
                    <FullscreenIcon className='size-4' />
                  </Button>
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

      <Separator />

      {/* Page Fullscreen Example */}
      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>Page Fullscreen</CardTitle>
          <CardDescription>
            Make the entire page fullscreen by not providing a target element
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Status Display */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>Page Fullscreen Status</p>
              <div className='flex items-center gap-2'>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isPageFullscreen
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {isPageFullscreen ? 'Fullscreen' : 'Normal'}
                </span>
                {!isPageSupported && (
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
                onClick={enterPage}
                disabled={!isPageSupported || isPageFullscreen}
              >
                <MonitorIcon className='mr-2 size-4' />
                Enter Page Fullscreen
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={togglePage}
                disabled={!isPageSupported}
              >
                Toggle Page Fullscreen
              </Button>
              {isPageFullscreen && (
                <Button type='button' variant='outline' onClick={exitPage}>
                  Exit Fullscreen
                </Button>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
            <p className='text-sm text-blue-800 dark:text-blue-200'>
              💡 When no target element is provided, the hook defaults to{' '}
              <code className='rounded bg-blue-100 px-1 py-0.5 font-mono text-xs dark:bg-blue-800'>
                document.documentElement
              </code>
              , making the entire page fullscreen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
