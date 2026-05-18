import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Autoformalization Limitations',
  description: 'A living research blog tracking the current limits of neural-symbolic autoformalization for mathematics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: 'var(--paper)', minHeight: '100vh' }}>
        <header style={{ borderBottom: '2px solid var(--ink)', background: 'var(--paper)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-light)' }}>
                Research Blog · Neural-Symbolic Autoformalization
              </span>
              <a href="https://a2dr1.github.io" className="back-link">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Austin Shen
              </a>
            </div>
            <h1 className="font-serif" style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 500, lineHeight: 1.15, marginBottom: 8 }}>
              Current Limitations of{' '}
              <em style={{ color: 'var(--accent)' }}>Autoformalization</em>{' '}
              for Mathematics
            </h1>
            <p style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 20 }}>
              A living document tracking open problems, recent papers, and field progress. Lean 4 / Mathlib.
            </p>
            <nav style={{ display: 'flex', gap: 0 }}>
              {[
                { href: '/',          label: 'Limitations' },
                { href: '/papers',    label: 'Papers'      },
                { href: '/changelog', label: 'Changelog'   },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  fontSize: 13, fontWeight: 500,
                  padding: '10px 20px',
                  color: 'var(--ink-light)',
                  textDecoration: 'none',
                  borderBottom: '3px solid transparent',
                  marginBottom: -2,
                  display: 'inline-block',
                }}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px 80px' }}>
          {children}
        </main>
        <footer style={{ borderTop: '1px solid var(--rule)', padding: '20px 32px', textAlign: 'center' }}>
          <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.05em' }}>
            For corrections and updates →{' '}
            <Link href="/admin" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Admin</Link>
          </span>
        </footer>
      </body>
    </html>
  )
}
