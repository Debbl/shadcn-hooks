import {
  homeMarkdown,
  linkHeaderValue,
  markdownTokenCount,
} from '~/lib/agent-discovery'

export const dynamic = 'force-static'

export function GET() {
  return new Response(homeMarkdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Link': linkHeaderValue,
      'x-markdown-tokens': markdownTokenCount(homeMarkdown),
    },
  })
}
