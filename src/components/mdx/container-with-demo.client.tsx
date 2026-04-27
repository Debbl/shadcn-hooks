'use client'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { SquareArrowOutUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'
import { createPortal } from 'react-dom'
import { cn } from '~/lib/utils'
import { useIsHydrated } from '~/registry/hooks/use-is-hydrated'
import { buttonVariants } from '../ui/button'
import { ResizablePanel, ResizablePanelGroup } from '../ui/resizable'

export interface ContainerWithDemoProps {
  name: string
  children: React.ReactNode
  code?: string
}

export function ContainerWithDemoClient({
  name,
  children,
  code = '',
}: ContainerWithDemoProps) {
  const [view] = useQueryState('view', parseAsString)

  const pathname = usePathname()
  const isHydrated = useIsHydrated()

  if (view === name) {
    return (
      <>
        {isHydrated ? (
          createPortal(
            <div className='bg-background fixed inset-0 z-50'>{children}</div>,
            document.body,
          )
        ) : (
          <div className='bg-background fixed inset-0 z-50 flex items-center justify-center'>
            Loading...
          </div>
        )}
      </>
    )
  }

  return (
    <div className='not-prose relative'>
      <Tabs items={['Preview', 'Code']}>
        <Tab value='Preview'>
          <ResizablePanelGroup
            orientation='horizontal'
            className='bg-transparent'
          >
            <ResizablePanel defaultSize={100} className='bg-transparent'>
              {children}
            </ResizablePanel>
            {/* <ResizableHandle withHandle className='bg-transparent' /> */}
            <ResizablePanel />
          </ResizablePanelGroup>
        </Tab>
        <Tab value='Code'>
          <DynamicCodeBlock lang='tsx' code={code} />
        </Tab>
      </Tabs>
      <div className='absolute top-1 right-1 flex items-center gap-1'>
        <Link
          className={cn(
            buttonVariants({
              variant: 'ghost',
              size: 'sm',
            }),
          )}
          target='_blank'
          href={`${pathname}?view=${name}`}
        >
          <SquareArrowOutUpRightIcon />
        </Link>
      </div>
    </div>
  )
}
