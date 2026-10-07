import type { ReactNode } from 'react'
import Link from 'next/link'
import { connection } from 'next/server'
import './globals.css'

export const metadata = {
  title: 'Strict CSP and inline styles',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // A nonce only works if every response is rendered for its own request.
  await connection()

  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/broken">Broken</Link>
          <Link href="/fix-static">Fix 1: static class</Link>
          <Link href="/fix-cssom">Fix 2: CSSOM</Link>
          <Link href="/fix-nonce-style">Fix 3: style with nonce</Link>
          <Link href="/fix-stylesheet">Fix 4: stylesheet route</Link>
          <Link href="/experiment">Experiment</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
