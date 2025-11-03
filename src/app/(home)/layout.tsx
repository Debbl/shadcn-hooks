import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions } from '~/app/layout.config'
import type { ReactNode } from 'react'

export { metadata } from '../layout'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions}
      suppressHydrationWarning
      className='min-h-screen'
      links={[
        {
          type: 'main',
          on: 'nav',
          text: 'Docs',
          url: '/docs/introduction',
        },
        {
          type: 'main',
          on: 'nav',
          text: 'Hooks',
          url: '/docs/hooks/use-counter',
        },
      ]}
    >
      {children}
    </HomeLayout>
  )
}
