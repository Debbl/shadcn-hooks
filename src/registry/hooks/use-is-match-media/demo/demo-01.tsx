'use client'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useIsMatchMedia } from '..'

export function Demo01() {
  const isMatch = useIsMatchMedia('(min-width: 768px)')

  return (
    <Card className='ring-0'>
      <CardHeader>
        <CardTitle>Media Query Match</CardTitle>
        <CardDescription>
          Check if a media query matches the current viewport
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='text-sm'>
          <span className='font-medium'>Media Query: </span>
          <code className='text-muted-foreground font-mono text-xs'>
            (min-width: 768px)
          </code>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Is Match:</span>
          <Badge variant={isMatch ? 'default' : 'secondary'}>
            {isMatch ? 'Yes' : 'No'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
