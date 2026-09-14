/// <reference types="./worker-configuration.d.ts" />
import { isMarkdownPreferred } from 'fumadocs-core/negotiation'

const markdownContentType = 'text/markdown; charset=utf-8'

function varyByAccept(headers: Headers): void {
  const vary =
    headers
      .get('Vary')
      ?.split(',')
      .map((value) => value.trim()) ?? []
  if (vary.some((value) => value === '*' || value.toLowerCase() === 'accept'))
    return
  headers.set('Vary', [...vary, 'Accept'].join(', '))
}

function markdownPathname(pathname: string): string | undefined {
  const normalizedPathname =
    pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname

  if (
    normalizedPathname === '/' ||
    normalizedPathname === '/index' ||
    normalizedPathname === '/index.html'
  ) {
    return '/index.md'
  }

  if (normalizedPathname === '/docs') {
    return '/llms.txt'
  }

  if (normalizedPathname.startsWith('/docs/')) {
    return `/llms.mdx/${normalizedPathname.slice('/docs/'.length)}`
  }

  return undefined
}

function markdownTokenCount(markdown: string): string {
  return markdown.trim().split(/\s+/).filter(Boolean).length.toString()
}

function markdownResponse(markdown: string, headers: Headers): Response {
  const nextHeaders = new Headers(headers)
  nextHeaders.set('Content-Type', markdownContentType)
  varyByAccept(nextHeaders)
  nextHeaders.set('x-markdown-tokens', markdownTokenCount(markdown))

  return new Response(markdown, { headers: nextHeaders })
}

async function fetchMarkdownAsset(
  request: Request,
  env: Env,
): Promise<Response | undefined> {
  const url = new URL(request.url)
  const pathname = markdownPathname(url.pathname)
  if (!pathname) return undefined

  const markdownUrl = new URL(request.url)
  markdownUrl.pathname = pathname
  markdownUrl.search = ''

  const response = await env.ASSETS.fetch(
    new Request(markdownUrl, {
      headers: request.headers,
      method: 'GET',
    }),
  )

  if (!response.ok) return undefined

  return markdownResponse(await response.text(), response.headers)
}

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'GET' && isMarkdownPreferred(request)) {
      const response = await fetchMarkdownAsset(request, env)
      if (response) return response
    }

    const response = await env.ASSETS.fetch(request)
    if (!markdownPathname(new URL(request.url).pathname)) return response

    const headers = new Headers(response.headers)
    varyByAccept(headers)
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
} satisfies ExportedHandler<Env>
