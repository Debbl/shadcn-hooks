import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { websiteConfig } from '~/constants'

export default function Page() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold'>
        A comprehensive React Hooks Collection built with Shadcn
      </h1>
      <div className='mt-4 flex gap-4'>
        <Button asChild>
          <Link href='/docs/introduction'>
            Get Started <ArrowRightIcon />
          </Link>
        </Button>
        <Button asChild variant='outline'>
          <Link href='/docs/hooks/use-counter'>Browse Hooks</Link>
        </Button>
      </div>

      <footer className='text-muted-foreground fixed bottom-4 mt-4 text-sm'>
        Built by{' '}
        <Link href='https://aiwan.run' className='underline' target='_blank'>
          Debbl66
        </Link>
        . The source code is available on{' '}
        <Link
          href={websiteConfig.githubUrl}
          className='underline'
          target='_blank'
        >
          GitHub
        </Link>
        .
      </footer>
    </div>
  )
}
