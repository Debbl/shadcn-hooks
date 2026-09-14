import { render, waitFor } from '@testing-library/react'
import { createSearchAPI } from 'fumadocs-core/search/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WebMcpProvider } from '../src/components/webmcp-provider'

afterEach(() => {
  Reflect.deleteProperty(navigator, 'modelContext')
  vi.unstubAllGlobals()
})

describe('webmcp search', () => {
  it('returns search results from the static index', async () => {
    const server = createSearchAPI('simple', {
      indexes: [
        {
          title: 'useDebounce',
          content: 'Debounce a value',
          url: '/docs/hooks/use-debounce',
        },
        {
          title: 'useCounter',
          content: 'Increment a counter',
          url: '/docs/hooks/use-counter',
        },
      ],
    })
    const fetchIndex = vi.fn<typeof fetch>(() => server.staticGET())
    vi.stubGlobal('fetch', fetchIndex)
    const provideContext =
      vi.fn<NonNullable<Navigator['modelContext']>['provideContext']>()
    Object.defineProperty(navigator, 'modelContext', {
      configurable: true,
      value: { provideContext },
    })
    const { unmount } = render(<WebMcpProvider />)
    await waitFor(() => expect(provideContext).toHaveBeenCalledOnce())
    const search = provideContext.mock.calls[0][0].tools.find(
      (tool) => tool.name === 'search_docs',
    )
    expect(search).toBeDefined()
    expect(await search?.execute({ query: '' })).toEqual({
      error: 'query is required',
    })
    const results = await search?.execute({ query: 'useDebounce' })
    expect(results).toEqual([
      expect.objectContaining({ url: '/docs/hooks/use-debounce' }),
    ])
    expect(fetchIndex).toHaveBeenCalledWith('/api/search')
    unmount()
  })
})
