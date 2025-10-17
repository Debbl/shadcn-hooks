'use client'
import { useIsOnline } from '..'

export function Demo01() {
  const isOnline = useIsOnline()

  return (
    <div>
      <p>Is Online: {isOnline ? 'Yes' : 'No'}</p>
    </div>
  )
}
