'use client'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { useActiveElement } from '..'

function formatElementLabel(element: Element | null): string {
  if (!element) {
    return 'None'
  }

  const tagName = element.tagName.toLowerCase()
  const id = element.id ? `#${element.id}` : ''
  const name = element.getAttribute('name')
  const nameSelector = name ? `[name="${name}"]` : ''

  return `${tagName}${id}${nameSelector}`
}

export function Demo01() {
  const activeElement = useActiveElement()
  const label = formatElementLabel(activeElement)

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Track Focused Element</CardTitle>
        <CardDescription>
          Focus different controls and watch the active element update in
          realtime.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Input id='focus-input' name='demo-input' placeholder='Focus input' />
        <Textarea
          id='focus-textarea'
          name='demo-textarea'
          placeholder='Focus textarea'
        />
        <Button id='focus-button' name='demo-button' type='button'>
          Focus button
        </Button>
        <p className='text-sm'>
          Active element:{' '}
          <code className='bg-muted rounded px-2 py-1 text-xs'>{label}</code>
        </p>
      </CardContent>
    </Card>
  )
}
