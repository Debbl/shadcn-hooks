import { RootProvider } from 'fumadocs-ui/provider'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import SearchDialog from '~/components/search'
import { domMax, LazyMotion } from '~/lib/motion'

export interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
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
  )
}
