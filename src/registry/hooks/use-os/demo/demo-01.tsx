'use client'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useOs } from '..'
import type { UseOSReturnValue } from '..'

const OS_LABELS: Record<UseOSReturnValue, string> = {
  undetermined: 'Undetermined',
  macos: 'macOS',
  ios: 'iOS',
  windows: 'Windows',
  android: 'Android',
  linux: 'Linux',
  chromeos: 'ChromeOS',
}

export function Demo01() {
  const os = useOs()

  return (
    <Card className='shadow-none ring-0'>
      <CardHeader>
        <CardTitle>Operating System</CardTitle>
        <CardDescription>
          Detect the current operating system from the browser environment
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Detected OS:</span>
          <Badge variant={os === 'undetermined' ? 'secondary' : 'default'}>
            {OS_LABELS[os]}
          </Badge>
        </div>

        <p className='text-muted-foreground text-sm'>
          By default, the hook returns <code>undetermined</code> during SSR and
          resolves after hydration. Use{' '}
          <code>{`{ getValueInEffect: false }`}</code> in client-only components
          to read the value on the first render.
        </p>
      </CardContent>
    </Card>
  )
}
