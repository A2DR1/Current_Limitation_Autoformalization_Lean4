import { db } from '@/lib/db'
import Link from 'next/link'

const SEV_CLASS: Record<string, string> = {
  major: 'sev-major', minor: 'sev-minor', structural: 'sev-structural', open: 'sev-open-q'
}
const STATUS_CLASS: Record<string, string> = {
  open: 'status-open', partial: 'status-partial', resolved: 'status-resolved'
}

export default function HomePage() {
  const categories  = db.categories()
  const limitations = db.limitations()
  const papers      = db.papers()

  const total    = limitations.length
  const open     = limitations.filter(l => l.status === 'open').length
  const partial  = limitations.filter(l => l.status === 'partial').length
  const resolved = limitations.filter(l => l.status === 'resolved').length

  return (
    <div>
      {/* Abstract */}
      <div style={{ borderLeft: '3px solid var(--accent)', background: 'var(--paper-dark)', padding: '18px 22px', marginBottom: 32, fontFamily: "'EB Garamond', serif", fontSize: 17, lineHeight: 1.7, color: 'var(--ink-mid)' }}>
        <strong style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: 8 }}>Abstract</strong>
        Recent advances in LLMs demonstrate high proficiency in informal mathematical reasoning and code generation.
        However, end-to-end autoformalization — translating natural language mathematics into formal verifiers like Lean 4 — remains brittle.
        This blog tracks structural and semantic bottlenecks, updated as new papers emerge.
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 36 }}>
        {[
          { n: total,    label: 'Total' },
          { n: open,     label: 'Open',     cls: 'status-open' },
          { n: partial,  label: 'Partial',  cls: 'status-partial' },
          { n: resolved, label: 'Resolved', cls: 'status-resolved' },
        ].map(({ n, label, cls }) => (
          <div key={label} style={{ background: 'white', border: '1px solid var(--rule)', padding: '16px 18px' }}>
            <div className="font-serif" style={{ fontSize: 36, fontWeight: 500, color: 'var(--accent)', lineHeight: 1 }}>{n}</div>
            {cls
              ? <span className={`font-mono ${cls}`} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 2, marginTop: 6, display: 'inline-block', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
              : <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
            }
          </div>
        ))}
      </div>

      {/* Grouped by category */}
      {categories.map(cat => {
        const lims = limitations.filter(l => l.category === cat.id)
        if (lims.length === 0) return null
        return (
          <div key={cat.id} style={{ marginBottom: 44 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, paddingBottom: 10, borderBottom: '2px solid var(--ink)', marginBottom: 0 }}>
              <span style={{ fontSize: 16 }}>{cat.icon}</span>
              <span className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>{cat.name}</span>
              <span style={{ fontSize: 13, color: 'var(--ink-light)', fontStyle: 'italic', flex: 1 }}>{cat.desc}</span>
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{lims.length} error{lims.length !== 1 ? 's' : ''}</span>
            </div>

            {lims.map((lim, i) => {
              const addressingPapers = papers.filter(p => p.addresses.includes(lim.id))
              return (
                <details key={lim.id} style={{ borderBottom: '1px solid var(--rule)', background: 'white' }}
                  className={i === 0 ? 'border-t' : ''}>
                  <summary style={{ listStyle: 'none', padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <span className="font-serif" style={{ fontSize: 18, color: 'var(--accent)', minWidth: 26, opacity: 0.7 }}>{String(i+1).padStart(2,'0')}.</span>
                    <span style={{ flex: 1 }}>
                      <span className="font-serif" style={{ fontSize: 19, fontWeight: 500, display: 'block', marginBottom: 5 }}>{lim.title}</span>
                      <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span className={`font-mono ${SEV_CLASS[lim.severity] ?? 'sev-minor'}`} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lim.severity}</span>
                        <span className={`font-mono ${STATUS_CLASS[lim.status]}`} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lim.status}</span>
                      </span>
                    </span>
                    <span style={{ color: 'var(--ink-faint)', fontSize: 13, marginTop: 4 }}>▾</span>
                  </summary>

                  <div style={{ padding: '4px 22px 22px 62px', borderTop: '1px solid var(--paper-dark)' }}>
                    <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '14px 0 5px' }}>Description</div>
                    <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.65 }}>{lim.desc}</p>

                    {lim.issue && <>
                      <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '14px 0 5px' }}>The Issue</div>
                      <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.65 }}>{lim.issue}</p>
                    </>}

                    {lim.failure && <>
                      <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '14px 0 5px' }}>Failure Mode</div>
                      <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.65 }}>{lim.failure}</p>
                    </>}

                    {(lim.exInput || lim.exOutput) && <>
                      <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '14px 0 5px' }}>Example</div>
                      <div style={{ background: 'var(--paper-dark)', borderLeft: '2px solid var(--rule)', padding: '10px 14px' }}>
                        {lim.exInput && <div style={{ fontSize: 14, marginBottom: 3 }}><span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8 }}>Input</span>{lim.exInput}</div>}
                        {lim.exOutput && <div style={{ fontSize: 14 }}><span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8 }}>Output</span><code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: '#eee9e3', padding: '1px 5px', borderRadius: 2, color: 'var(--accent)' }}>{lim.exOutput}</code></div>}
                      </div>
                    </>}

                    {lim.refs.length > 0 && <>
                      <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '14px 0 5px' }}>References</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {lim.refs.map(r => <span key={r} className="font-mono" style={{ fontSize: 11, border: '1px solid var(--rule)', padding: '1px 7px', borderRadius: 2, color: 'var(--ink-faint)' }}>{r}</span>)}
                      </div>
                    </>}

                    {addressingPapers.length > 0 && <>
                      <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '14px 0 5px' }}>Addressed / Partially Addressed By</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {addressingPapers.map(p => (
                          <Link key={p.id} href={`/papers#${p.id}`} style={{ textDecoration: 'none' }}>
                            <span style={{ fontSize: 13, color: 'var(--accent)', borderBottom: '1px solid var(--rule)', paddingBottom: 2 }}>
                              {p.title} <span style={{ color: 'var(--ink-faint)' }}>({p.year})</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </>}
                  </div>
                </details>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
