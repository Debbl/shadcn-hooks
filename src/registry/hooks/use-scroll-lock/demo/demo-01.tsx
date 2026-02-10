'use client'
import { LockIcon, UnlockIcon } from 'lucide-react'
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
import { useScrollLock } from '..'

export function Demo01() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Page-level scroll lock (no target = document.body)
  const { isLocked, lock, unlock } = useScrollLock({
    autoLock: false,
  })

  // Container-level scroll lock
  const {
    isLocked: isContainerLocked,
    lock: lockContainer,
    unlock: unlockContainer,
  } = useScrollLock({
    autoLock: false,
    // eslint-disable-next-line react-hooks/refs
    lockTarget: containerRef.current || undefined,
  })

  // Auto-lock example (commented out to not interfere with demo)
  // const { isLocked: isAutoLocked } = useScrollLock({ autoLock: true })

  return (
    <div className='space-y-4'>
      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>useScrollLock Demo</CardTitle>
          <CardDescription>
            A hook to lock scroll on the page or specific elements
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Status Display */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>Page Scroll Status</p>
              <div className='flex items-center gap-2'>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isLocked
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <LockIcon className='mr-1 size-3' />
                      Locked
                    </>
                  ) : (
                    <>
                      <UnlockIcon className='mr-1 size-3' />
                      Unlocked
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Page Scroll Controls</p>
            <div className='flex flex-wrap items-center gap-2'>
              <Button
                type='button'
                onClick={lock}
                disabled={isLocked}
                variant={isLocked ? 'secondary' : 'default'}
              >
                <LockIcon className='mr-2 size-4' />
                Lock Page Scroll
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={unlock}
                disabled={!isLocked}
              >
                <UnlockIcon className='mr-2 size-4' />
                Unlock Page Scroll
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
            <p className='text-sm text-blue-800 dark:text-blue-200'>
              💡 Try scrolling this page after locking the scroll. The page
              scroll will be disabled, but you can still interact with other
              elements.
            </p>
          </div>

          {/* Scrollable Content for Testing */}
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Test Content</p>
            <div className='space-y-2'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`test-content-${i}`}
                  className='rounded-lg border bg-gray-50 p-4 dark:bg-gray-900'
                >
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    Content block {i + 1} - Try scrolling when the page is
                    locked
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Container Scroll Lock Example */}
      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>Container Scroll Lock</CardTitle>
          <CardDescription>
            Lock scroll on a specific container element instead of the entire
            page
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Status Display */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>Container Scroll Status</p>
              <div className='flex items-center gap-2'>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isContainerLocked
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {isContainerLocked ? (
                    <>
                      <LockIcon className='mr-1 size-3' />
                      Locked
                    </>
                  ) : (
                    <>
                      <UnlockIcon className='mr-1 size-3' />
                      Unlocked
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Container Controls</p>
            <div className='flex flex-wrap items-center gap-2'>
              <Button
                type='button'
                onClick={lockContainer}
                disabled={isContainerLocked}
                variant={isContainerLocked ? 'secondary' : 'default'}
              >
                <LockIcon className='mr-2 size-4' />
                Lock Container Scroll
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={unlockContainer}
                disabled={!isContainerLocked}
              >
                <UnlockIcon className='mr-2 size-4' />
                Unlock Container Scroll
              </Button>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Scrollable Container</p>
            <div
              ref={containerRef}
              className='h-60 space-y-2 overflow-auto rounded-lg border bg-gray-50 p-4 dark:bg-gray-900'
            >
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`container-item-${i}`}
                  className='rounded-lg border bg-white p-3 dark:bg-gray-800'
                >
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    Container item {i + 1} - This container has its own scroll
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20'>
            <p className='text-sm text-amber-800 dark:text-amber-200'>
              ⚠️ When you lock the container scroll, only that specific
              container's scroll will be disabled. The page scroll will remain
              functional.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Notes */}
      <Card className='shadow-none ring-0'>
        <CardHeader>
          <CardTitle>Usage Notes</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3 text-sm'>
          <div>
            <p className='font-medium'>Options:</p>
            <ul className='mt-2 list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300'>
              <li>
                <code className='rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800'>
                  autoLock
                </code>{' '}
                - Automatically lock scroll on mount (default: true)
              </li>
              <li>
                <code className='rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800'>
                  lockTarget
                </code>{' '}
                - HTML element or selector to lock (default: document.body)
              </li>
              <li>
                <code className='rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800'>
                  widthReflow
                </code>{' '}
                - Prevent width reflow by adding padding (default: true)
              </li>
            </ul>
          </div>
          <div>
            <p className='font-medium'>Common Use Cases:</p>
            <ul className='mt-2 list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300'>
              <li>Modal dialogs and overlays</li>
              <li>Full-screen navigation menus</li>
              <li>Image lightboxes</li>
              <li>Preventing scroll during animations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
