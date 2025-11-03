import bundleAnalyzer from '@next/bundle-analyzer'
import withSerwistInit from '@serwist/next'
import { createMDX } from 'fumadocs-mdx/next'
import AutoImport from 'unplugin-auto-import/webpack'
import type { NextConfig } from 'next'

const withMDX = createMDX()

const withBundleAnalyzer = bundleAnalyzer({
  // eslint-disable-next-line n/prefer-global/process
  enabled: process.env.ANALYZE === 'true',
})

const withSerwist = withSerwistInit({
  disable: true,
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
})

const nextConfig: NextConfig = {
  output: 'export',
  reactCompiler: true,
  webpack: (config) => {
    config.plugins.push(
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        ],
        imports: [
          'react',
          {
            twl: ['cn'],
          },
          {
            from: 'motion/react-m',
            imports: [['*', 'motion']],
          },
        ],
        dts: true,
      }),
    )

    return config
  },
}

export default [withBundleAnalyzer, withSerwist, withMDX].reduce(
  (config, withFn) => withFn(config),
  nextConfig,
)
