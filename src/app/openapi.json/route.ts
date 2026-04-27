import { jsonResponse, openApiDocument } from '~/lib/agent-discovery'

export const dynamic = 'force-static'

export function GET() {
  return jsonResponse(openApiDocument(), 'application/openapi+json')
}
