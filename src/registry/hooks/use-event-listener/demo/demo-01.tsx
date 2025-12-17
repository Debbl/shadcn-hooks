'use client'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useEventListener } from '..'

export function Demo01() {
  const [windowSize, setWindowSize] = useState(() => ({
    width: 0,
    height: 0,
  }))
  const [scrollY, setScrollY] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [keyPressed, setKeyPressed] = useState<string>('')
  const buttonRef = useRef<HTMLDivElement>(null)

  // Window resize event
  useEventListener('resize', () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  })

  // Window scroll event
  useEventListener('scroll', () => {
    setScrollY(window.scrollY)
  })

  // Element click event
  useEventListener(
    'click',
    () => {
      setClickCount((prev) => prev + 1)
    },
    {
      target: buttonRef,
    },
  )

  // Keyboard event
  useEventListener('keydown', (event) => {
    setKeyPressed(event.key)
  })

  return (
    <div className='space-y-6'>
      <Card className='ring-0'>
        <CardHeader>
          <CardTitle>Window Events</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p>
              Window Size: {windowSize.width} × {windowSize.height}px
            </p>
            <p className='text-muted-foreground text-sm'>
              Try resizing your browser window
            </p>
          </div>
          <div>
            <p>Scroll Position: {scrollY}px</p>
            <p className='text-muted-foreground text-sm'>
              Try scrolling this page
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className='ring-0'>
        <CardHeader>
          <CardTitle>Element Events</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Button ref={buttonRef}>Click me! (Clicked: {clickCount})</Button>
          <p className='text-muted-foreground text-sm'>
            Click the button above to see the counter increase
          </p>
        </CardContent>
      </Card>

      <Card className='ring-0'>
        <CardHeader>
          <CardTitle>Keyboard Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Last Key Pressed: {keyPressed || 'None'}</p>
          <p className='text-muted-foreground text-sm'>
            Press any key on your keyboard
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
