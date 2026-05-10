import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkPassword } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const pw = req.headers.get('x-admin-password') ?? ''
  if (!checkPassword(pw)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({
    categories:  db.categories(),
    limitations: db.limitations(),
    papers:      db.papers(),
    changelog:   db.changelog(),
  })
}

export async function POST(req: NextRequest) {
  const pw = req.headers.get('x-admin-password') ?? ''
  if (!checkPassword(pw)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, action, payload } = body

  try {
    if (type === 'limitation') {
      let items = db.limitations()
      if (action === 'upsert') {
        const idx = items.findIndex(x => x.id === payload.id)
        if (idx > -1) items[idx] = payload
        else items.push({ ...payload, id: payload.id || Date.now().toString() })
      } else if (action === 'delete') {
        items = items.filter(x => x.id !== payload.id)
      }
      db.save.limitations(items)

    } else if (type === 'paper') {
      let items = db.papers()
      if (action === 'upsert') {
        const idx = items.findIndex(x => x.id === payload.id)
        if (idx > -1) items[idx] = payload
        else items.push(payload)
      } else if (action === 'delete') {
        items = items.filter(x => x.id !== payload.id)
      }
      db.save.papers(items)

    } else if (type === 'changelog') {
      let items = db.changelog()
      if (action === 'upsert') {
        const idx = items.findIndex(x => x.id === payload.id)
        if (idx > -1) items[idx] = payload
        else items.push({ ...payload, id: payload.id || `cl-${Date.now()}` })
      } else if (action === 'delete') {
        items = items.filter(x => x.id !== payload.id)
      }
      db.save.changelog(items)

    } else if (type === 'category') {
      let items = db.categories()
      if (action === 'upsert') {
        const idx = items.findIndex(x => x.id === payload.id)
        if (idx > -1) items[idx] = payload
        else items.push(payload)
      } else if (action === 'delete') {
        items = items.filter(x => x.id !== payload.id)
      }
      db.save.categories(items)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
