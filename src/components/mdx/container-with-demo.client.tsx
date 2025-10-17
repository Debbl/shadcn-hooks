'use client'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { SmartphoneIcon, SquareArrowOutUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { parseAsString, useQueryState } from 'nuqs'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~/lib/utils'
import { useIsHydrated } from '~/registry/hooks/use-is-hydrated'
import { Button, buttonVariants } from '../ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable'
import type { ImperativePanelHandle } from 'react-resizable-panels'

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
  const [phoneView, setPhoneView] = useState(false)
  const viewPanelRef = useRef<ImperativePanelHandle>(null)
  const [view] = useQueryState('view', parseAsString)

  const showPhoneView = () => {
    const size = viewPanelRef.current?.getSize()
    const newPhoneView = !phoneView
    if (viewPanelRef.current && size) {
      newPhoneView
        ? viewPanelRef.current.resize(50)
        : viewPanelRef.current.resize(100)
    }

    setPhoneView(newPhoneView)
  }

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
    <div className='relative'>
      <Tabs items={['Preview', 'Code']}>
        <Tab value='Preview'>
          <ResizablePanelGroup
            direction='horizontal'
            className='bg-transparent'
          >
            <ResizablePanel
              ref={viewPanelRef}
              defaultSize={100}
              className='bg-transparent'
            >
              {children}
            </ResizablePanel>
            <ResizableHandle withHandle className='bg-transparent' />
            <ResizablePanel />
          </ResizablePanelGroup>
        </Tab>
        <Tab value='Code'>
          <DynamicCodeBlock lang='tsx' code={code} />
        </Tab>
      </Tabs>
      <div className='absolute top-1 right-1 flex items-center gap-1'>
        <Button
          variant={phoneView ? 'secondary' : 'ghost'}
          size='sm'
          onClick={showPhoneView}
        >
          <SmartphoneIcon />
        </Button>
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
