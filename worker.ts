/// <reference types="./worker-configuration.d.ts" />

const markdownContentType = 'text/markdown; charset=utf-8'

function acceptsMarkdown(request: Request): boolean {
  const accept = request.headers.get('Accept')
  if (!accept) return false

  return accept.split(',').some((entry) => {
    const [mediaType, ...parameters] = entry
      .split(';')
      .map((part) => part.trim().toLowerCase())

    if (mediaType !== 'text/markdown') return false

    const quality = parameters.find((parameter) => parameter.startsWith('q='))
    return quality ? Number.parseFloat(quality.slice(2)) > 0 : true
  })
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
  nextHeaders.set('Vary', 'Accept')
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
    if (request.method === 'GET' && acceptsMarkdown(request)) {
      const response = await fetchMarkdownAsset(request, env)
      if (response) return response
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
