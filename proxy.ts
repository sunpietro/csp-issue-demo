import { NextRequest, NextResponse } from 'next/server'

// The strict policy from the Next.js CSP guide, with one change: CSP_MODE lets
// you run the same build with the policy enforced, report-only, or off, so you
// can see what each environment would hide from you.
//
//   CSP_MODE=enforce      (default) Content-Security-Policy
//   CSP_MODE=report-only  Content-Security-Policy-Report-Only: logs, blocks nothing
//   CSP_MODE=off          no policy, the way many teams run local development

type CspMode = 'enforce' | 'report-only' | 'off'

function cspMode(): CspMode {
  const mode = process.env.CSP_MODE

  return mode === 'off' || mode === 'report-only' ? mode : 'enforce'
}

export function proxy(request: NextRequest) {
  const mode = cspMode()

  if (mode === 'off') {
    return NextResponse.next()
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  // Next.js reads the nonce from the request's Content-Security-Policy header
  // and stamps it on every script it renders, so set it there in every mode.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', policy)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  const header = mode === 'report-only' ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'
  response.headers.set(header, policy)

  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|css/).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
