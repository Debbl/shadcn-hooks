'use client'
import { ArrowRightIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'
import {
  GithubStars,
  GithubStarsIcon,
  GithubStarsLogo,
  GithubStarsNumber,
  GithubStarsParticles,
} from '~/components/animate-ui/primitives/animate/github-stars'
import { Button } from '~/components/ui/button'
import { websiteConfig } from '~/constants'

export default function Page() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-y-4'>
      <h1 className='text-center text-4xl font-bold'>
        A comprehensive React Hooks Collection built with Shadcn
      </h1>

      <div className='mt-4 flex gap-4'>
        <Button
          nativeButton={false}
          render={(props) => (
            <Link {...props} href='/docs/introduction'>
              Get Started <ArrowRightIcon />
            </Link>
          )}
        />
        <Button
          nativeButton={false}
          variant='outline'
          render={(props) => (
            <Link {...props} href='/docs/hooks/use-boolean'>
              Browse Hooks
            </Link>
          )}
        />
      </div>

      <div className='flex h-9 items-center justify-center'>
        <GithubStars username='Debbl' repo='shadcn-hooks'>
          <Link
            href={websiteConfig.githubUrl}
            rel='noreferrer noopener'
            target='_blank'
            className='group group hover:bg-fd-accent hover:text-fd-accent-foreground text-fd-muted-foreground flex cursor-pointer items-center justify-center gap-x-2 rounded-md p-1.5 text-sm font-medium transition-colors duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 sm:mt-1 [&_svg]:size-5 sm:[&_svg]:size-5.5'
          >
            <GithubStarsLogo className='size-6' />

            <span className='bg-accent flex items-center gap-x-1 rounded-lg py-1 pr-1.25 pl-1.5 text-sm select-none group-hover:bg-white dark:group-hover:bg-neutral-900'>
              <GithubStarsNumber />
              <GithubStarsParticles>
                <GithubStarsIcon
                  icon={StarIcon}
                  className='size-4!'
                  activeClassName='text-muted-foreground group-hover:text-current'
                />
              </GithubStarsParticles>
            </span>
          </Link>
        </GithubStars>
      </div>

      <footer className='text-muted-foreground fixed bottom-4 mt-4 text-xs md:text-sm'>
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
