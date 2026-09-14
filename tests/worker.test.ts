// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import worker from '../worker'

function createEnv() {
  const fetchAsset = vi.fn<Env['ASSETS']['fetch']>(async (input) => {
    const url = new URL(input instanceof Request ? input.url : String(input))
    if (url.pathname.startsWith('/llms.mdx/')) {
      return new Response('# Documentation', {
        headers: { Vary: 'Accept-Encoding' },
      })
    }
    return new Response('<html>Documentation</html>', {
      headers: { 'Content-Type': 'text/html', 'Vary': 'Accept-Encoding' },
    })
  })
  const env: Env = {
    ASSETS: { fetch: fetchAsset, connect: vi.fn<Env['ASSETS']['connect']>() },
  }
  return { env, fetchAsset }
}

describe('documentation content negotiation', () => {
  it('preserves existing Vary values on HTML responses', async () => {
    const { env } = createEnv()
    const response = await worker.fetch(
      new Request('https://example.com/docs/hooks/use-debounce'),
      env,
    )
    expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept')
    expect(await response.text()).toContain('<html>')
  })

  it('serves Markdown when preferred and keeps cache variants separate', async () => {
    const { env, fetchAsset } = createEnv()
    const response = await worker.fetch(
      new Request('https://example.com/docs/hooks/use-debounce', {
        headers: { Accept: 'text/markdown, text/html;q=0.5' },
      }),
      env,
    )
    expect(fetchAsset).toHaveBeenCalledOnce()
    expect(response.headers.get('Content-Type')).toBe(
      'text/markdown; charset=utf-8',
    )
    expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept')
    expect(await response.text()).toBe('# Documentation')
  })

  it.each(['text/html, text/markdown;q=0.5', 'text/markdown;q=0'])(
    'serves HTML for Accept: %s',
    async (accept) => {
      const { env } = createEnv()
      const response = await worker.fetch(
        new Request('https://example.com/docs/hooks/use-debounce', {
          headers: { Accept: accept },
        }),
        env,
      )
      expect(await response.text()).toContain('<html>')
      expect(response.headers.get('Vary')).toContain('Accept')
    },
  )

  it('does not add Accept variance to unrelated assets', async () => {
    const { env } = createEnv()
    const response = await worker.fetch(
      new Request('https://example.com/logo.svg'),
      env,
    )
    expect(response.headers.get('Vary')).toBe('Accept-Encoding')
  })

  it('retains cache variance when a Markdown asset is missing', async () => {
    const { env, fetchAsset } = createEnv()
    fetchAsset.mockResolvedValueOnce(new Response('Missing', { status: 404 }))
    const response = await worker.fetch(
      new Request('https://example.com/docs/missing', {
        headers: { Accept: 'text/markdown' },
      }),
      env,
    )
    expect(fetchAsset).toHaveBeenCalledTimes(2)
    expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept')
    expect(await response.text()).toContain('<html>')
  })
})
