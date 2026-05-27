import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import { websiteConfig } from '~/constants'
import { Providers } from '~/providers'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(websiteConfig.baseUrl),
  title: 'Shadcn Hooks',
  description: 'A comprehensive React Hooks Collection built with Shadcn',
  authors: [{ name: 'Brendan Dash', url: 'https://aiwan.run' }],
  keywords: ['react', 'hooks', 'shadcn', 'ui', 'components'],
  alternates: {
    canonical: websiteConfig.baseUrl,
  },
  appleWebApp: {
    title: 'Shadcn Hooks',
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      url: '/favicon-96x96.png',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/favicon.svg',
    },
    {
      rel: 'shortcut icon',
      url: '/favicon.ico',
    },
    {
      rel: 'app-touch-icon',
      sizes: '180x180',
      url: '/apple-touch-icon.png',
    },
  ],
  openGraph: {
    title: 'Shadcn Hooks',
    description: 'A comprehensive React Hooks Collection built with Shadcn',
    url: websiteConfig.baseUrl,
  },
}

// eslint-disable-next-line n/prefer-global/process
const isDev = process.env.NODE_ENV === 'development'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          defer
          src='https://umami.aiwan.run/script.js'
          data-website-id='5e235d4d-68e3-4298-a9ab-b24727d5af31'
        />
        {isDev && (
          <Fragment>
            <Script
              src='//unpkg.com/react-scan/dist/auto.global.js'
              crossOrigin='anonymous'
              strategy='beforeInteractive'
            />
            <Script
              src='//unpkg.com/react-grab/dist/index.global.js'
              crossOrigin='anonymous'
              strategy='beforeInteractive'
            />
          </Fragment>
        )}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId='G-PZCVKTSB2B' />
    </html>
  )
}
