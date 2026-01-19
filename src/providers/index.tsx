import { RootProvider } from 'fumadocs-ui/provider/next'
import { domMax, LazyMotion } from 'motion/react'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { SerwistProvider } from '~/app/serwist'
import SearchDialog from '~/components/search'

export interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SerwistProvider swUrl='/sw.js' disable>
      <RootProvider
        search={{
          enabled: true,
          SearchDialog,
          options: {
            type: 'static',
          },
        }}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <LazyMotion strict features={domMax}>
              {children}
            </LazyMotion>
          </NuqsAdapter>
        </ThemeProvider>
      </RootProvider>
    </SerwistProvider>
  )
}
