import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

function read<T>(file: string): T {
  const raw = fs.readFileSync(path.join(dataDir, file), 'utf-8')
  return JSON.parse(raw) as T
}

function write(file: string, data: unknown) {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2))
}

export type Severity = 'major' | 'minor' | 'structural' | 'open'
export type Status   = 'open' | 'partial' | 'resolved'

export interface Category {
  id: string; name: string; icon: string; desc: string
}

export interface Limitation {
  id: string; category: string; severity: Severity; title: string
  desc: string; issue: string; failure: string
  exInput: string; exOutput: string; refs: string[]
  status: Status; addressedBy: string[]
}

export interface Paper {
  id: string; title: string; authors: string; year: number; month: number
  venue: string; url: string; summary: string
  addresses: string[]; introduces: string[]; tags: string[]
}

export interface ChangelogEntry {
  id: string; date: string
  type: 'report' | 'progress' | 'new-finding' | 'resolved'
  title: string; body: string
  linkedPapers: string[]; linkedLimitations: string[]
}

export const db = {
  categories:  () => read<Category[]>('categories.json'),
  limitations: () => read<Limitation[]>('limitations.json'),
  papers:      () => read<Paper[]>('papers.json'),
  changelog:   () => read<ChangelogEntry[]>('changelog.json'),

  save: {
    categories:  (d: Category[])      => write('categories.json', d),
    limitations: (d: Limitation[])    => write('limitations.json', d),
    papers:      (d: Paper[])         => write('papers.json', d),
    changelog:   (d: ChangelogEntry[])=> write('changelog.json', d),
  }
}
