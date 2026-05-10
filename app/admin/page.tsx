'use client'
import { useState, useEffect } from 'react'

type Tab = 'limitations' | 'papers' | 'changelog' | 'categories'

const S = {
  input: {
    fontFamily: "'Source Sans 3', sans-serif", fontSize: 14,
    border: '1px solid var(--rule)', background: 'var(--paper)',
    padding: '8px 12px', outline: 'none', color: 'var(--ink)', width: '100%',
  } as React.CSSProperties,
  label: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
    letterSpacing: '0.12em', textTransform: 'uppercase' as const,
    color: 'var(--ink-light)', display: 'block', marginBottom: 4,
  } as React.CSSProperties,
  field: { display: 'flex', flexDirection: 'column' as const, gap: 4, marginBottom: 14 },
  btn: {
    fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, fontWeight: 500,
    padding: '7px 16px', border: '1px solid var(--rule)',
    background: 'white', cursor: 'pointer', color: 'var(--ink-mid)',
  } as React.CSSProperties,
  btnPrimary: {
    background: 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)',
    fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, fontWeight: 500,
    padding: '7px 16px', cursor: 'pointer',
  } as React.CSSProperties,
  btnDanger: {
    background: '#8b2020', color: 'white', border: '1px solid #8b2020',
    fontFamily: "'Source Sans 3', sans-serif", fontSize: 12,
    padding: '5px 12px', cursor: 'pointer',
  } as React.CSSProperties,
  card: { background: 'white', border: '1px solid var(--rule)', padding: '18px 22px', marginBottom: 0 },
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed,   setAuthed]   = useState(false)
  const [error,    setError]    = useState('')
  const [tab,      setTab]      = useState<Tab>('limitations')
  const [data,     setData]     = useState<any>(null)
  const [editing,  setEditing]  = useState<any>(null)
  const [editType, setEditType] = useState<Tab>('limitations')
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState('')

  async function login() {
    const res = await fetch('/api/admin', { headers: { 'x-admin-password': password } })
    if (res.ok) { setAuthed(true); setData(await res.json()) }
    else setError('Wrong password.')
  }

  async function reload() {
    const res = await fetch('/api/admin', { headers: { 'x-admin-password': password } })
    if (res.ok) setData(await res.json())
  }

  async function save(type: string, action: string, payload: any) {
    setSaving(true)
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'x-admin-password': password, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, action, payload }),
    })
    setSaving(false)
    if (res.ok) { setMsg('Saved ✓'); setEditing(null); await reload(); setTimeout(() => setMsg(''), 2000) }
    else setMsg('Error saving.')
  }

  async function del(type: string, id: string) {
    if (!confirm('Delete this entry?')) return
    await save(type, 'delete', { id })
  }

  function startNew(type: Tab) {
    const templates: Record<Tab, any> = {
      limitations: { id: '', title: '', category: '', severity: 'major', status: 'open', desc: '', issue: '', failure: '', exInput: '', exOutput: '', refs: [], addressedBy: [] },
      papers:      { id: '', title: '', authors: '', year: new Date().getFullYear(), month: new Date().getMonth() + 1, venue: '', url: '', summary: '', addresses: [], introduces: [], tags: [] },
      changelog:   { id: '', date: new Date().toISOString().split('T')[0], type: 'progress', title: '', body: '', linkedPapers: [], linkedLimitations: [] },
      categories:  { id: '', name: '', icon: '◆', desc: '' },
    }
    setEditType(type); setEditing({ ...templates[type] })
  }

  function Field({ label, name, type = 'text', rows }: { label: string; name: string; type?: string; rows?: number }) {
    const val = editing?.[name] ?? ''
    const onChange = (e: any) => setEditing((p: any) => ({ ...p, [name]: e.target.value }))
    return (
      <div style={S.field}>
        <label style={S.label}>{label}</label>
        {rows
          ? <textarea rows={rows} value={val} onChange={onChange} style={{ ...S.input, resize: 'vertical' }} />
          : <input type={type} value={val} onChange={onChange} style={S.input} />
        }
      </div>
    )
  }

  function ArrayField({ label, name }: { label: string; name: string }) {
    const val: string[] = editing?.[name] ?? []
    return (
      <div style={S.field}>
        <label style={S.label}>{label} (comma-separated)</label>
        <input style={S.input} value={val.join(', ')}
          onChange={e => setEditing((p: any) => ({ ...p, [name]: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }))} />
      </div>
    )
  }

  function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
    return (
      <div style={S.field}>
        <label style={S.label}>{label}</label>
        <select value={editing?.[name] ?? ''} onChange={e => setEditing((p: any) => ({ ...p, [name]: e.target.value }))} style={S.input}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }

  if (!authed) return (
    <div style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center' }}>
      <div className="font-serif" style={{ fontSize: 28, fontWeight: 500, marginBottom: 8 }}>Admin</div>
      <p style={{ fontSize: 14, color: 'var(--ink-light)', marginBottom: 24 }}>Enter your admin password to edit the blog.</p>
      <div style={S.field}>
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ ...S.input, textAlign: 'center', fontSize: 16 }} />
      </div>
      {error && <p style={{ color: 'var(--accent)', fontSize: 13, margin: '8px 0' }}>{error}</p>}
      <button onClick={login} style={{ ...S.btnPrimary, width: '100%', padding: '10px 0', marginTop: 8 }}>Unlock</button>
    </div>
  )

  const tabs: Tab[] = ['limitations', 'papers', 'changelog', 'categories']

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="font-serif" style={{ fontSize: 26, fontWeight: 500 }}>Admin Editor</div>
          <div className="font-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>Changes save directly to JSON files.</div>
        </div>
        {msg && <span className="font-mono" style={{ fontSize: 12, color: msg.includes('Error') ? 'var(--accent)' : 'var(--green)', background: 'var(--paper-dark)', padding: '4px 12px', borderRadius: 2 }}>{msg}</span>}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--ink)', marginBottom: 28 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => { setTab(t); setEditing(null) }} style={{
            ...S.btn, border: 'none', borderBottom: `3px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
            color: tab === t ? 'var(--ink)' : 'var(--ink-light)', marginBottom: -2,
            fontWeight: tab === t ? 600 : 500, textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {/* Edit form */}
      {editing && (
        <div style={{ background: 'var(--paper-dark)', border: '1px dashed var(--rule)', padding: '24px 28px', marginBottom: 28 }}>
          <div className="font-serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 18 }}>
            {editing.id ? 'Edit' : 'New'} {editType.slice(0, -1)}
          </div>

          {editType === 'limitations' && <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <Field label="Title *" name="title" />
              <Field label="ID (auto if blank)" name="id" />
              <Select label="Category" name="category" options={data?.categories?.map((c: any) => c.id) ?? []} />
              <Select label="Severity" name="severity" options={['major','minor','structural','open']} />
              <Select label="Status" name="status" options={['open','partial','resolved']} />
            </div>
            <Field label="Description *" name="desc" rows={3} />
            <Field label="The Issue" name="issue" rows={2} />
            <Field label="Failure Mode" name="failure" rows={2} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <Field label="Example Input" name="exInput" />
              <Field label="Example Output" name="exOutput" />
            </div>
            <ArrayField label="References" name="refs" />
            <ArrayField label="Addressed By (paper IDs)" name="addressedBy" />
          </>}

          {editType === 'papers' && <>
            <Field label="ID (unique slug) *" name="id" />
            <Field label="Title *" name="title" />
            <Field label="Authors" name="authors" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 20px' }}>
              <Field label="Year" name="year" type="number" />
              <Field label="Month (1–12)" name="month" type="number" />
              <Field label="Venue" name="venue" />
            </div>
            <Field label="URL (optional)" name="url" />
            <Field label="Summary *" name="summary" rows={3} />
            <ArrayField label="Addresses (limitation IDs)" name="addresses" />
            <ArrayField label="Introduces (limitation IDs)" name="introduces" />
            <ArrayField label="Tags" name="tags" />
          </>}

          {editType === 'changelog' && <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <Field label="Date (YYYY-MM-DD) *" name="date" />
              <Select label="Type" name="type" options={['report','progress','new-finding','resolved']} />
            </div>
            <Field label="Title *" name="title" />
            <Field label="Body *" name="body" rows={4} />
            <ArrayField label="Linked Paper IDs" name="linkedPapers" />
            <ArrayField label="Linked Limitation IDs" name="linkedLimitations" />
          </>}

          {editType === 'categories' && <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '0 20px' }}>
              <Field label="Name *" name="name" />
              <Field label="Description" name="desc" />
              <Field label="Icon" name="icon" />
            </div>
            <Field label="ID (auto-generated from name if blank)" name="id" />
          </>}

          <div style={{ display: 'flex', gap: 10, marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
            <button disabled={saving} onClick={() => save(editType.slice(0,-1) === 'categorie' ? 'category' : editType.slice(0,-1), 'upsert', editing)} style={S.btnPrimary}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} style={S.btn}>Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button onClick={() => startNew(tab)} style={S.btnPrimary}>+ New {tab.slice(0,-1)}</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tab === 'limitations' && data?.limitations?.map((lim: any, i: number) => (
          <div key={lim.id} style={{ ...S.card, borderTop: i === 0 ? '1px solid var(--rule)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="font-serif" style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>{lim.title}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="font-mono" style={{ fontSize: 10, background: 'var(--paper-dark)', padding: '1px 7px', borderRadius: 2, color: 'var(--ink-light)' }}>{lim.category}</span>
                  <span className="font-mono" style={{ fontSize: 10, background: 'var(--paper-dark)', padding: '1px 7px', borderRadius: 2, color: 'var(--ink-light)' }}>{lim.severity}</span>
                  <span className="font-mono" style={{ fontSize: 10, background: 'var(--paper-dark)', padding: '1px 7px', borderRadius: 2, color: 'var(--ink-light)' }}>{lim.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setEditType('limitations'); setEditing({ ...lim }) }} style={S.btn}>Edit</button>
                <button onClick={() => del('limitation', lim.id)} style={S.btnDanger}>Delete</button>
              </div>
            </div>
          </div>
        ))}

        {tab === 'papers' && data?.papers?.map((p: any, i: number) => (
          <div key={p.id} style={{ ...S.card, borderTop: i === 0 ? '1px solid var(--rule)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="font-serif" style={{ fontSize: 17, fontWeight: 500, marginBottom: 2 }}>{p.title}</div>
                <div className="font-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{p.venue} · {p.year}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setEditType('papers'); setEditing({ ...p }) }} style={S.btn}>Edit</button>
                <button onClick={() => del('paper', p.id)} style={S.btnDanger}>Delete</button>
              </div>
            </div>
          </div>
        ))}

        {tab === 'changelog' && data?.changelog?.sort((a: any, b: any) => b.date.localeCompare(a.date)).map((entry: any, i: number) => (
          <div key={entry.id} style={{ ...S.card, borderTop: i === 0 ? '1px solid var(--rule)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginBottom: 4 }}>{entry.date} · {entry.type}</div>
                <div className="font-serif" style={{ fontSize: 17, fontWeight: 500 }}>{entry.title}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setEditType('changelog'); setEditing({ ...entry }) }} style={S.btn}>Edit</button>
                <button onClick={() => del('changelog', entry.id)} style={S.btnDanger}>Delete</button>
              </div>
            </div>
          </div>
        ))}

        {tab === 'categories' && data?.categories?.map((cat: any, i: number) => (
          <div key={cat.id} style={{ ...S.card, borderTop: i === 0 ? '1px solid var(--rule)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <span style={{ fontSize: 22 }}>{cat.icon}</span>
                <div>
                  <div className="font-serif" style={{ fontSize: 17, fontWeight: 500 }}>{cat.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-light)' }}>{cat.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setEditType('categories'); setEditing({ ...cat }) }} style={S.btn}>Edit</button>
                <button onClick={() => del('category', cat.id)} style={S.btnDanger}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
