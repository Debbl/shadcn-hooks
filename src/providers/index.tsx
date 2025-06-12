import { RootProvider } from 'fumadocs-ui/provider'
import { ThemeProvider } from 'next-themes'
import { domMax, LazyMotion } from '~/lib/motion'

export interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <RootProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <LazyMotion strict features={domMax}>
          {children}
        </LazyMotion>
      </ThemeProvider>
    </RootProvider>
  )
}
