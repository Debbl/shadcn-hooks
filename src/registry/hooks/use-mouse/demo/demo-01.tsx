'use client'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useMouse } from '..'

export function Demo01() {
  const mouse = useMouse()

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Mouse Position</CardTitle>
        <CardDescription>
          Move your mouse or touch the screen to update coordinates
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-3 text-sm'>
          <div>
            <p className='text-muted-foreground'>X</p>
            <p className='font-mono text-lg'>{mouse.x}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Y</p>
            <p className='font-mono text-lg'>{mouse.y}</p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-sm'>Source</span>
          <Badge variant={mouse.sourceType ? 'default' : 'secondary'}>
            {mouse.sourceType ?? 'none'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
