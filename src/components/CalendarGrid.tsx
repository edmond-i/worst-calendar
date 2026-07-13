import { useEffect, useMemo, useState } from 'react'
import { useChaos } from '../hooks/ChaosContext'
import { useCursorAvoidance } from '../hooks/useCursorAvoidance'
import { chaoticDateLabel, generateChaosGrid } from '../utils/dateChaos'

const CLASH_CLASSES = ['clash-a', 'clash-b', 'clash-c', 'clash-d', 'clash-e']
const FONT_CLASSES = ['fs-tiny', 'fs-small', 'fs-normal', 'fs-big', 'fs-huge']

export function CalendarGrid() {
  const { level } = useChaos()
  const [anchor, setAnchor] = useState(new Date())
  const avoid = useCursorAvoidance({ triggerRadius: 180, maxOffset: 70 })

  // At 'chaos' level the grid periodically reshuffles itself on a timer,
  // so even staring at the same month without touching anything doesn't
  // stay put.
  const [regenKey, setRegenKey] = useState(0)
  useEffect(() => {
    if (level !== 'chaos') return
    const id = window.setInterval(() => setRegenKey((k) => k + 1), 4000)
    return () => window.clearInterval(id)
  }, [level])

  const cells = useMemo(
    () => generateChaosGrid(anchor, level),
    [anchor, level, regenKey]
  )

  return (
    <div className="calendar-shell">
      <div className="calendar-toolbar">
        <button onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1))}>
          ‹ back-ish
        </button>
        <span className="calendar-title">{chaoticDateLabel(anchor)}</span>
        <button onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1))}>
          forward-ish ›
        </button>
      </div>

      <div ref={avoid.ref} style={avoid.style} className="calendar-grid">
        {cells.map((cell, i) => {
          const clash = CLASH_CLASSES[i % CLASH_CLASSES.length]
          const font = FONT_CLASSES[Math.floor(Math.random() * FONT_CLASSES.length)]
          const pad = level === 'off' ? 8 : 4 + Math.floor(Math.random() * 20)
          return (
            <div
              key={`${cell.date.toISOString()}-${i}`}
              className={`calendar-cell ${clash} ${font} ${cell.fakeToday ? 'fake-today' : ''}`}
              style={{ padding: `${pad}px` }}
            >
              <div className="cell-date">{chaoticDateLabel(cell.date)}</div>
              {cell.fakeToday && <div className="cell-today-badge">TODAY</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
