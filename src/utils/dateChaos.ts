import type { ChaosLevel } from '../hooks/ChaosContext'

// All of these mangle *display* only. The underlying Date/ISO value passed
// in is never mutated, so nothing here can actually corrupt event data.

const FAKE_TZ_LABELS = ['GMT', 'UTC±?', 'Local-ish', 'CST*', 'Zone 4', '(see footer)', 'PST/EST', '???']

const DATE_FORMATS: Array<(d: Date) => string> = [
  (d) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`,
  (d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`,
  (d) => `${d.getFullYear()}.${d.getDate()}.${d.getMonth() + 1}`,
  (d) => `${d.getDate()}-${d.getMonth() + 1}-${String(d.getFullYear()).slice(2)}`,
  (d) => d.toLocaleDateString(undefined, { weekday: 'short' }) + ` wk${getWeekNumber(d)}`,
  (d) => `${d.getMonth() + 1}${d.getDate()}${d.getFullYear()}`,
]

function getWeekNumber(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
}

// Deterministic-ish per render call (not per-date), so the same date can
// render differently in two places on screen at once — that's the point.
export function chaoticDateLabel(d: Date): string {
  const fmt = DATE_FORMATS[Math.floor(Math.random() * DATE_FORMATS.length)]
  return fmt(d)
}

export function confusingTimeLabel(d: Date): string {
  const showTz = Math.random() > 0.5
  const hours24 = Math.random() > 0.5
  const h = hours24 ? d.getHours() : (d.getHours() % 12 || 12)
  const m = String(d.getMinutes()).padStart(2, '0')
  const suffix = hours24 ? '' : d.getHours() >= 12 ? ' PM' : ' AM'
  const tz = showTz ? ` ${FAKE_TZ_LABELS[Math.floor(Math.random() * FAKE_TZ_LABELS.length)]}` : ''
  return `${h}:${m}${suffix}${tz}`
}

export interface ChaosCell {
  date: Date
  fakeToday: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Builds a 42-cell grid (6 rows x 7 cols) but, depending on chaos level,
// the dates it contains span well beyond a single month and are reordered
// so the grid no longer reads as a clean sequence. Real "today" is never
// included as a cheat sheet — instead 0-3 unrelated cells get flagged as
// fake "today" markers.
export function generateChaosGrid(anchor: Date, level: ChaosLevel): ChaosCell[] {
  const base = new Date(anchor.getFullYear(), anchor.getMonth(), 1)

  if (level === 'off') {
    const startOffset = base.getDay()
    const cells: ChaosCell[] = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(base)
      d.setDate(1 - startOffset + i)
      cells.push({ date: d, fakeToday: false })
    }
    return cells
  }

  const spreadDays = level === 'chaos' ? 220 : 60
  const dates: Date[] = []
  for (let i = 0; i < 42; i++) {
    const offset = Math.floor(Math.random() * spreadDays) - spreadDays / 2
    const d = new Date(base)
    d.setDate(base.getDate() + offset)
    dates.push(d)
  }

  const ordered = level === 'chaos' ? shuffle(dates) : dates.sort((a, b) => a.getTime() - b.getTime())
  const fakeTodayCount = level === 'chaos' ? 3 : 1
  const fakeTodayIdx = new Set<number>()
  while (fakeTodayIdx.size < fakeTodayCount) {
    fakeTodayIdx.add(Math.floor(Math.random() * ordered.length))
  }

  return ordered.map((date, i) => ({ date, fakeToday: fakeTodayIdx.has(i) }))
}
