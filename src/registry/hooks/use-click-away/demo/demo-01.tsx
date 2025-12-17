'use client'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useClickAway } from '..'

export function Demo01() {
  const [isOpen, setIsOpen] = useState(false)
  const [clickAwayCount, setClickAwayCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickAway(() => {
    setIsOpen(false)
    setClickAwayCount((prev) => prev + 1)
  }, containerRef)

  return (
    <div className='space-y-6'>
      <Card className='ring-0'>
        <CardHeader>
          <CardTitle>Click Away Demo</CardTitle>
          <CardDescription>
            Click the button to open the dropdown, then click outside to close
            it.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-4'>
            <div ref={containerRef} className='relative inline-block'>
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger
                  render={(props) => (
                    <Button
                      {...props}
                      type='button'
                      variant={isOpen ? 'default' : 'outline'}
                    >
                      {isOpen ? 'Close Menu' : 'Open Menu'}
                    </Button>
                  )}
                ></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Menu Items</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setIsOpen(false)}>
                    Item 1
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-sm'>
              Menu is: <strong>{isOpen ? 'Open' : 'Closed'}</strong>
            </p>
            <p className='text-muted-foreground text-sm'>
              Click away count: <strong>{clickAwayCount}</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
