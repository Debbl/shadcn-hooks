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
          fill='none'
          className='size-4'
        >
          <path
            d='M208 128L128 208'
            stroke='currentColor'
            strokeWidth='32'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M192 40L40 192'
            stroke='currentColor'
            strokeWidth='32'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M90 65C90 78.8071 78.8071 90 65 90C51.1928 90 40 78.8071 40 65C40 51.1929 51.1928 40 65 40C78.8071 40 90 51.1929 90 65Z'
            fill='currentColor'
          />
        </svg>
        Shadcn Hooks
      </>
    ),
  },
  githubUrl: 'https://github.com/Debbl/shadcn-hooks',
}
