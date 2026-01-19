import bundleAnalyzer from '@next/bundle-analyzer'
import { createMDX } from 'fumadocs-mdx/next'
import { createAutoImport } from 'next-auto-import'
import type { NextConfig } from 'next'

const withMDX = createMDX()

const withBundleAnalyzer = bundleAnalyzer({
  // eslint-disable-next-line n/prefer-global/process
  enabled: process.env.ANALYZE === 'true',
})

const withAutoImport = createAutoImport({
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
})

const nextConfig: NextConfig = {
  output: 'export',
  reactCompiler: true,
}

export default [withBundleAnalyzer, withMDX, withAutoImport].reduce(
  (config, withFn) => withFn(config),
  nextConfig,
)
