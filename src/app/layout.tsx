import { Providers } from '~/providers'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://shadcn-hooks.vercel.app'),
  title: 'Shadcn Hooks',
  description: 'A comprehensive React Hooks Collection built with Shadcn',
  authors: [{ name: 'Brendan Dash', url: 'https://aiwan.run' }],
  keywords: ['react', 'hooks', 'shadcn', 'ui', 'components'],
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
    description: 'Shadcn Hooks',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          defer
          src='https://umami.aiwan.run/script.js'
          data-website-id='5e235d4d-68e3-4298-a9ab-b24727d5af31'
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
