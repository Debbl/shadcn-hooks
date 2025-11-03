import { websiteConfig } from '~/constants'
import { source } from '~/lib/source'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = source.getPages()

  return [
    {
      url: websiteConfig.baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...pages.map((page) => {
      return {
        url: websiteConfig.baseUrl + page.url,
        changeFrequency: 'weekly',
        lastModified: new Date(page.data.lastModified ?? new Date()),
        priority: 0.5,
      } satisfies MetadataRoute.Sitemap[number]
    }),
  ]
}
