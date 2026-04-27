'use client'

import { useEffect } from 'react'

interface WebMcpInputSchema {
  type: 'object'
  properties?: Record<string, unknown>
  required?: string[]
  additionalProperties?: boolean
}

interface WebMcpTool {
  name: string
  description: string
  inputSchema: WebMcpInputSchema
  execute: (input: unknown) => Promise<unknown> | unknown
}

interface WebMcpContext {
  tools: WebMcpTool[]
}

interface ModelContext {
  provideContext: (context: WebMcpContext) => Promise<void> | void
}

declare global {
  interface Navigator {
    modelContext?: ModelContext
  }
}

function readStringField(input: unknown, field: string): string | null {
  if (typeof input !== 'object' || input == null) return null

  const value = (input as Record<string, unknown>)[field]
  return typeof value === 'string' ? value : null
}

const tools: WebMcpTool[] = [
  {
    name: 'search_docs',
    description: 'Search the Shadcn Hooks documentation.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query.',
        },
      },
      required: ['query'],
      additionalProperties: false,
    },
    async execute(input) {
      const query = readStringField(input, 'query')

      if (!query) {
        return { error: 'query is required' }
      }

      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`,
      )
      const contentType = response.headers.get('content-type') ?? ''

      if (contentType.includes('application/json')) {
        return response.json()
      }

      return { text: await response.text() }
    },
  },
  {
    name: 'list_agent_resources',
    description: 'List agent-oriented discovery resources for Shadcn Hooks.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
    },
    execute() {
      return {
        resources: [
          { name: 'Documentation', url: '/docs' },
          { name: 'LLM docs index', url: '/llms.txt' },
          { name: 'Full LLM docs', url: '/llms-full.txt' },
          { name: 'API catalog', url: '/.well-known/api-catalog' },
          { name: 'Agent skills', url: '/.well-known/agent-skills/index.json' },
        ],
      }
    },
  },
  {
    name: 'open_docs',
    description: 'Navigate the browser to a Shadcn Hooks documentation path.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'A documentation path beginning with /docs.',
        },
      },
      required: ['path'],
      additionalProperties: false,
    },
    execute(input) {
      const path = readStringField(input, 'path')

      if (!path?.startsWith('/docs')) {
        return { error: 'path must begin with /docs' }
      }

      window.location.assign(path)
      return { opened: path }
    },
  },
]

export function WebMcpProvider() {
  useEffect(() => {
    void navigator.modelContext?.provideContext({ tools })
  }, [])

  return null
}
