import { db } from '@/lib/db'
import Link from 'next/link'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function PapersPage() {
  const papers      = db.papers().sort((a, b) => b.year - a.year || b.month - a.month)
  const limitations = db.limitations()

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 className="font-serif" style={{ fontSize: 30, fontWeight: 500, marginBottom: 6 }}>Papers</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-light)' }}>
          {papers.length} paper{papers.length !== 1 ? 's' : ''} tracked · sorted by recency
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {papers.map((paper, i) => {
          const addressedLims  = limitations.filter(l => paper.addresses.includes(l.id))
          const introducedLims = limitations.filter(l => paper.introduces.includes(l.id))

          return (
            <div key={paper.id} id={paper.id} style={{
              border: '1px solid var(--rule)',
              borderTop: i === 0 ? '1px solid var(--rule)' : 'none',
              background: 'white', padding: '24px 28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.05em' }}>
                      {MONTHS[(paper.month ?? 1) - 1]} {paper.year}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--rule)' }}>·</span>
                    <span className="font-mono" style={{ fontSize: 11, background: 'var(--paper-dark)', color: 'var(--ink-light)', padding: '1px 8px', borderRadius: 2 }}>{paper.venue}</span>
                  </div>
                  <h3 className="font-serif" style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.25, marginBottom: 4 }}>
                    {paper.url
                      ? <a href={paper.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--rule)' }}>{paper.title}</a>
                      : paper.title
                    }
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 10 }}>{paper.authors}</p>
                  <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.65 }}>{paper.summary}</p>
                </div>
              </div>

              {/* Tags */}
              {paper.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  {paper.tags.map(t => (
                    <span key={t} className="font-mono" style={{ fontSize: 10, background: 'var(--paper-dark)', color: 'var(--ink-light)', padding: '2px 8px', borderRadius: 2, letterSpacing: '0.04em' }}>{t}</span>
                  ))}
                </div>
              )}

              {/* Limitations addressed */}
              {addressedLims.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--paper-dark)' }}>
                  <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 8 }}>Addresses</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {addressedLims.map(lim => (
                      <Link key={lim.id} href={`/#${lim.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="font-mono status-partial" style={{ fontSize: 10, padding: '1px 6px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>partial</span>
                        <span style={{ fontSize: 14, color: 'var(--accent)' }}>{lim.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Limitations introduced */}
              {introducedLims.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--paper-dark)' }}>
                  <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 8 }}>Introduced / Exposed</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {introducedLims.map(lim => (
                      <Link key={lim.id} href={`/#${lim.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="font-mono status-open" style={{ fontSize: 10, padding: '1px 6px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>new</span>
                        <span style={{ fontSize: 14, color: 'var(--accent)' }}>{lim.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
