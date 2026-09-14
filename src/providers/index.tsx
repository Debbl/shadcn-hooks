import { RootProvider } from 'fumadocs-ui/provider/next'
import { domMax, LazyMotion } from 'motion/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import SearchDialog from '~/components/search'
import { WebMcpProvider } from '~/components/webmcp-provider'

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
      <WebMcpProvider />
      <NuqsAdapter>
        <LazyMotion strict features={domMax}>
          {children}
        </LazyMotion>
      </NuqsAdapter>
    </RootProvider>
  )
}
