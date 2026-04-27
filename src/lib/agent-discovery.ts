import { createHash } from 'node:crypto'
import { websiteConfig } from '~/constants'

export const linkHeaderValue = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</docs>; rel="service-doc"',
  '</index.md>; rel="alternate"; type="text/markdown"',
  '</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json"',
].join(', ')

export const homeMarkdown = `# Shadcn Hooks

A comprehensive React Hooks collection built with Shadcn.

## Start here

- [Introduction](/docs/introduction)
- [Browse hooks](/docs/hooks/use-boolean)
- [LLM docs index](/llms.txt)
- [Full LLM docs](/llms-full.txt)
- [GitHub repository](https://github.com/Debbl/shadcn-hooks)
`

export const agentSkillMarkdown = `# Shadcn Hooks Agent Skill

Use this skill when an agent needs to discover, install, or explain React hooks published by Shadcn Hooks.

## Resources

- Documentation: /docs
- Hooks index: /docs/hooks/use-boolean
- LLM index: /llms.txt
- Full LLM documentation: /llms-full.txt

## Suggested Workflow

1. Read /llms.txt to discover available documentation pages.
2. Open the relevant /docs page for human-readable examples.
3. Use the registry JSON under /r when installing a hook in a shadcn-compatible project.
`

export function markdownTokenCount(markdown: string): string {
  return markdown.trim().split(/\s+/).length.toString()
}

export function sha256Digest(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function jsonResponse(value: unknown, contentType = 'application/json') {
  return new Response(JSON.stringify(value, null, 2), {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
    },
  })
}

export function textResponse(value: string, contentType: string) {
  return new Response(value, {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
    },
  })
}

export function siteUrl(path = ''): string {
  return new URL(path, websiteConfig.baseUrl).toString()
}

export function apiCatalog() {
  return {
    linkset: [
      {
        'anchor': siteUrl('/api/search'),
        'service-desc': [
          {
            href: siteUrl('/openapi.json'),
            type: 'application/openapi+json',
          },
        ],
        'service-doc': [
          {
            href: siteUrl('/docs'),
            type: 'text/html',
          },
        ],
        'status': [
          {
            href: siteUrl('/health'),
            type: 'application/json',
          },
        ],
      },
    ],
  }
}

export function openApiDocument() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Shadcn Hooks Public API',
      version: '0.0.7',
      description: 'Public discovery endpoints for Shadcn Hooks documentation.',
    },
    servers: [{ url: websiteConfig.baseUrl }],
    paths: {
      '/api/search': {
        get: {
          summary: 'Search documentation',
          parameters: [
            {
              name: 'query',
              in: 'query',
              required: false,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Search results from the documentation index.',
            },
          },
        },
      },
      '/llms.txt': {
        get: {
          summary: 'Return the LLM-oriented documentation index',
          responses: {
            '200': {
              description: 'Markdown text with documentation links.',
              content: {
                'text/plain': {
                  schema: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }
}

export function oauthAuthorizationServer() {
  return {
    issuer: websiteConfig.baseUrl,
    service_documentation: siteUrl('/docs'),
    grant_types_supported: [],
    response_types_supported: [],
    scopes_supported: [],
  }
}

export function oauthProtectedResource() {
  return {
    resource: websiteConfig.baseUrl,
    authorization_servers: [],
    scopes_supported: [],
    bearer_methods_supported: ['header'],
    resource_documentation: siteUrl('/docs'),
  }
}

export function mcpServerCard() {
  return {
    serverInfo: {
      name: 'shadcn-hooks',
      version: '0.0.7',
    },
    transport: {
      type: 'webmcp',
      endpoint: siteUrl('/'),
    },
    capabilities: {
      tools: true,
      resources: true,
      prompts: false,
    },
    resources: [
      {
        name: 'Documentation',
        uri: siteUrl('/docs'),
      },
      {
        name: 'LLM documentation index',
        uri: siteUrl('/llms.txt'),
      },
    ],
  }
}

export function agentSkillsIndex() {
  return {
    $schema: 'https://agentskills.io/schemas/agent-skills-index-v0.2.0.json',
    skills: [
      {
        name: 'shadcn-hooks',
        type: 'documentation',
        description:
          'Discover and use React hooks from the Shadcn Hooks registry.',
        url: siteUrl('/.well-known/agent-skills/shadcn-hooks.md'),
        sha256: sha256Digest(agentSkillMarkdown),
      },
    ],
  }
}
