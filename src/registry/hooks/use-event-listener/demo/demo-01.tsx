'use client'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { useEventListener } from '..'

export function Demo01() {
  const [windowSize, setWindowSize] = useState(() => ({
    width: 0,
    height: 0,
  }))
  const [scrollY, setScrollY] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [keyPressed, setKeyPressed] = useState<string>('')
  const buttonRef = useRef<HTMLButtonElement>(null)

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
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Window Events</h3>
        <div className='space-y-2 rounded-lg border p-4'>
          <p>
            Window Size: {windowSize.width} × {windowSize.height}px
          </p>
          <p className='text-muted-foreground text-sm'>
            Try resizing your browser window
          </p>
        </div>
        <div className='space-y-2 rounded-lg border p-4'>
          <p>Scroll Position: {scrollY}px</p>
          <p className='text-muted-foreground text-sm'>
            Try scrolling this page
          </p>
        </div>
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Element Events</h3>
        <div className='space-y-2 rounded-lg border p-4'>
          <Button ref={buttonRef} type='button'>
            Click me! (Clicked: {clickCount})
          </Button>
          <p className='text-muted-foreground text-sm'>
            Click the button above to see the counter increase
          </p>
        </div>
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Keyboard Events</h3>
        <div className='space-y-2 rounded-lg border p-4'>
          <p>Last Key Pressed: {keyPressed || 'None'}</p>
          <p className='text-muted-foreground text-sm'>
            Press any key on your keyboard
          </p>
        </div>
      </div>
    </div>
  )
}
