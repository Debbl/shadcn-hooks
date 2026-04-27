import { agentSkillMarkdown, textResponse } from '~/lib/agent-discovery'

export const dynamic = 'force-static'

export function GET() {
  return textResponse(agentSkillMarkdown, 'text/markdown')
}
