import { siteUrl, textResponse } from '~/lib/agent-discovery'

export const dynamic = 'force-static'

export function GET() {
  return textResponse(
    `User-Agent: *
Allow: /

Sitemap: ${siteUrl('/sitemap.xml')}

Content-Signal: ai-train=no, search=yes, ai-input=no
`,
    'text/plain',
  )
}
