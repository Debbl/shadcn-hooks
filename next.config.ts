import bundleAnalyzer from '@next/bundle-analyzer'
import withSerwistInit from '@serwist/next'
import { createMDX } from 'fumadocs-mdx/next'
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
}

export default [withBundleAnalyzer, withSerwist, withMDX].reduce(
  (config, withFn) => withFn(config),
  nextConfig,
)
