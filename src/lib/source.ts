import { loader } from 'fumadocs-core/source'
import { createMDXSource } from 'fumadocs-mdx/runtime/next'
import { docs, registry } from '../../.source'
import type { InferMetaType, InferPageType } from 'fumadocs-core/source'

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: '/docs',
  source: createMDXSource(
    [...docs.docs, ...registry.docs],
    [...docs.meta, ...registry.meta],
  ),
})

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
