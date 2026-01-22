import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { source } from '~/lib/source'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return source.generateParams().map((i) => ({
    slug: i.slug.concat(['opengraph-image']),
  }))
}

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/docs/og/[[...slug]]'>,
) {
  const { slug } = await ctx.params
  if (!slug) notFound()

  const page = source.getPage(slug.slice(0, -1))

  if (!page) notFound()

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='100'
          height='100'
          viewBox='0 0 256 256'
          className='size-4'
          fill='none'
        >
          <path
            d='M208 128L128 208'
            stroke='black'
            strokeWidth='32'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M192 40L40 192'
            stroke='black'
            strokeWidth='32'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <rect x='27' y='28' width='70' height='70' rx='7' fill='black' />
        </svg>
      </div>
      <div style={{ marginTop: 10 }}>{page.data.title}</div>
      <div
        style={{
          marginTop: 10,
          fontSize: '18px',
          color: 'oklch(37.3% 0.034 259.733)',
        }}
      >
        {page.data.description}
      </div>
    </div>,
    {
      width: 800,
      height: 400,
    },
  )
}
