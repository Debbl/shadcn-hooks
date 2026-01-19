import { loader, multiple } from 'fumadocs-core/source'
import { docs, registry } from '../../.source/server'
import type { InferMetaType, InferPageType } from 'fumadocs-core/source'

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    registry: registry.toFumadocsSource(),
  }),
  {
    // it assigns a URL to your pages
    baseUrl: '/docs',
  },
)

export type Page = InferPageType<typeof source>
export type Meta = InferMetaType<typeof source>
