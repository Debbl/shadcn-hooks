'use client'
import { useIsMatchMedia } from '..'

export function Demo01() {
  const isMatch = useIsMatchMedia('(min-width: 768px)')

  return (
    <div>
      <p>Media Query: (min-width: 768px)</p>
      <p>Is Match: {isMatch ? 'Yes' : 'No'}</p>
    </div>
  )
}
