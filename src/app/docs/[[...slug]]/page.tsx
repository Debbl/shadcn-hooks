import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import { websiteConfig } from '~/constants'
import { source } from '~/lib/source'
import { getMDXComponents } from '~/mdx-components'
import { GitHubLink, LLMCopyButton } from './page.client'
import type { Metadata } from 'next'

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const slug = params.slug ?? []
  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      lastUpdate={page.data.lastModified}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className='mb-8 flex flex-row items-center gap-2 border-b pb-6'>
        <LLMCopyButton slug={slug} url={page.url} />
        <GitHubLink
          url={`${websiteConfig.githubUrl}/blob/main/${page.absolutePath}`}
        />
      </div>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  // Calculate hash of the opengraph route file
  const routeFilePath = join(
    process.cwd(),
    'src/app/docs/og/[[...slug]]/route.tsx',
  )
  const routeFileContent = readFileSync(routeFilePath, 'utf-8')
  const hash = createHash('sha256')
    .update(routeFileContent)
    .digest('hex')
    .slice(0, 16)

  return {
    metadataBase: new URL(websiteConfig.baseUrl),
    title: `${page.data.title} - Shadcn Hooks`,
    description: page.data.description,
    alternates: {
      canonical: `/docs/${page.slugs.join('/')}`,
    },
    openGraph: {
      type: 'article',
      images: [`/docs/og/${page.slugs.join('/')}/opengraph-image?${hash}`],
      title: page.data.title,
      url: `/docs/${page.slugs.join('/')}`,
      description: page.data.description,
    },
    twitter: {
      creator: '@Debbl66',
    },
  }
}
