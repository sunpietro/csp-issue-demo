import type { NextRequest } from 'next/server'
import { gridClassName, isValidTrackList } from '@/lib/grid'

// GET /css/grid?c=<grid-template-columns value>
//
// The response is CSS from our own origin, so `style-src 'self'` allows it.
// That is also the risk: whatever this route echoes becomes trusted CSS, so it
// accepts only the characters a track list needs, and derives the class name
// itself instead of taking one from the URL.
export function GET(request: NextRequest) {
  const columns = request.nextUrl.searchParams.get('c') ?? ''

  if (!isValidTrackList(columns)) {
    return new Response('/* invalid track list */\n', {
      status: 400,
      headers: { 'Content-Type': 'text/css; charset=utf-8' },
    })
  }

  const css = `.${gridClassName(columns)} { grid-template-columns: ${columns}; }\n`

  return new Response(css, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
