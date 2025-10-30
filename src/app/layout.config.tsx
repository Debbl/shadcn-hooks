import { websiteConfig } from '~/constants'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='256'
          height='256'
          viewBox='0 0 256 256'
          className='size-4'
          fill='none'
        >
          <path
            d='M208 128L128 208'
            stroke='black'
            strokeWidth='32'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M192 40L40 192'
            stroke='black'
            strokeWidth='32'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <rect x='27' y='28' width='70' height='70' rx='7' fill='black' />
        </svg>
        Shadcn Hooks
      </>
    ),
  },
  githubUrl: websiteConfig.githubUrl,
}
