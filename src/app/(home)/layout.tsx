import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions } from '~/app/layout.config'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions}
      className='min-h-screen'
      links={[
        {
          type: 'main',
          on: 'nav',
          text: 'Docs',
          url: '/docs/introduction',
        },
      ]}
    >
      {children}
    </HomeLayout>
  )
}
