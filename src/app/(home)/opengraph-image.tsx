/* eslint-disable react-refresh/only-export-components */
import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

// Image metadata
export const alt = 'A comprehensive React Hooks Collection built with Shadcn'

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
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
        <div style={{ marginTop: 40 }}>Shadcn Hooks</div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    },
  )
}
