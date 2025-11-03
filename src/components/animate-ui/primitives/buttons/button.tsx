'use client'

import * as React from 'react'
import { Slot } from '~/components/animate-ui/primitives/animate/slot'
import type { WithAsChild } from '~/components/animate-ui/primitives/animate/slot'

type ButtonProps = WithAsChild<
  React.ComponentProps<typeof motion.button> & {
    hoverScale?: number
    tapScale?: number
  }
>

function Button({
  hoverScale = 1.05,
  tapScale = 0.95,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : motion.button

  return (
    <Component
      whileTap={{ scale: tapScale }}
      whileHover={{ scale: hoverScale }}
      {...props}
    />
  )
}

export { Button, type ButtonProps }
