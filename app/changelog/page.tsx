import { db } from '@/lib/db'
import Link from 'next/link'

const TYPE_CLASS: Record<string, string> = {
  'report':      'type-report',
  'progress':    'type-progress',
  'new-finding': 'type-new-finding',
  'resolved':    'type-resolved',
}

const TYPE_LABEL: Record<string, string> = {
  'report':      'Report',
  'progress':    'Progress',
  'new-finding': 'New Finding',
  'resolved':    'Resolved',
}

export default function ChangelogPage() {
  const changelog   = db.changelog().sort((a, b) => b.date.localeCompare(a.date))
  const papers      = db.papers()
  const limitations = db.limitations()

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <h2 className="font-serif" style={{ fontSize: 30, fontWeight: 500, marginBottom: 6 }}>Changelog</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-light)' }}>
          A chronological record of how understanding in this field has evolved.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 1, background: 'var(--rule)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingLeft: 44 }}>
          {changelog.map(entry => {
            const linkedPapers = papers.filter(p => entry.linkedPapers.includes(p.id))
            const linkedLims   = limitations.filter(l => entry.linkedLimitations.includes(l.id))
            const date = new Date(entry.date)
            const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

            return (
              <div key={entry.id} style={{ position: 'relative' }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute', left: -36, top: 20,
                  width: 12, height: 12, borderRadius: '50%',
                  background: 'var(--accent)', border: '2px solid var(--paper)',
                  boxShadow: '0 0 0 2px var(--accent)'
                }} />

                <div style={{ background: 'white', border: '1px solid var(--rule)', padding: '22px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.05em' }}>{dateStr}</span>
                    <span className={`font-mono ${TYPE_CLASS[entry.type]}`} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {TYPE_LABEL[entry.type]}
                    </span>
                  </div>

                  <h3 className="font-serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 8, lineHeight: 1.25 }}>{entry.title}</h3>
                  <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.65 }}>{entry.body}</p>

                  {linkedPapers.length > 0 && (
                    <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', alignSelf: 'center' }}>Papers:</span>
                      {linkedPapers.map(p => (
                        <Link key={p.id} href={`/papers#${p.id}`} style={{ textDecoration: 'none' }}>
                          <span className="font-mono" style={{ fontSize: 11, background: 'var(--paper-dark)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 2, border: '1px solid var(--rule)' }}>
                            {p.title.length > 50 ? p.title.slice(0, 50) + '…' : p.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {linkedLims.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', alignSelf: 'center' }}>Limitations:</span>
                      {linkedLims.map(l => (
                        <Link key={l.id} href={`/#lim-${l.id}`} style={{ textDecoration: 'none' }}>
                          <span className="font-mono" style={{ fontSize: 11, background: 'var(--paper-dark)', color: 'var(--ink-mid)', padding: '2px 8px', borderRadius: 2, border: '1px solid var(--rule)' }}>
                            {l.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
