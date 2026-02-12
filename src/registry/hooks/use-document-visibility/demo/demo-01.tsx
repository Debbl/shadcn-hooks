'use client'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useDocumentVisibility } from '..'

export function Demo01() {
  const visibilityState = useDocumentVisibility()
  const isVisible = visibilityState === 'visible'

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Document Visibility</CardTitle>
        <CardDescription>
          Track whether the current tab is visible or hidden
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Visibility State:</span>
          <Badge variant={isVisible ? 'default' : 'secondary'}>
            {visibilityState}
          </Badge>
        </div>
        <p className='text-muted-foreground text-sm'>
          Switch to another tab and come back to see the value update.
        </p>
      </CardContent>
    </Card>
  )
}
