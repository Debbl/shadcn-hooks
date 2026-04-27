import { jsonResponse, oauthAuthorizationServer } from '~/lib/agent-discovery'

export const dynamic = 'force-static'

export function GET() {
  return jsonResponse(oauthAuthorizationServer())
}
