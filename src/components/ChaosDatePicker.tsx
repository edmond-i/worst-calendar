import { useCursorAvoidance } from '../hooks/useCursorAvoidance'
import { chaoticDateLabel } from '../utils/dateChaos'

interface OptionProps {
  date: Date
  selected: boolean
  onSelect: (d: Date) => void
}

// Each option flees independently, so hovering toward one can shove its
// neighbors around too — this needs to be its own component since hooks
// must run per-instance.
function FleeingDateOption({ date, selected, onSelect }: OptionProps) {
  const avoid = useCursorAvoidance<HTMLButtonElement>({ triggerRadius: 90, maxOffset: 55, bounded: true })
  return (
    <button
      ref={avoid.ref}
      style={avoid.style}
      type="button"
      className={`date-option ${selected ? 'date-option-selected' : ''}`}
      onClick={() => onSelect(date)}
    >
      {chaoticDateLabel(date)}
    </button>
  )
}

interface Props {
  label: string
  value: Date
  onChange: (d: Date) => void
  rangeDays?: number
}

export function ChaosDatePicker({ label, value, onChange, rangeDays = 14 }: Props) {
  const today = new Date()
  const options: Date[] = []
  for (let i = 0; i < rangeDays; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    options.push(d)
  }

  return (
    <div className="chaos-picker">
      <div className="chaos-picker-label">{label}</div>
      <div className="chaos-picker-field">
        {options.map((d) => (
          <FleeingDateOption key={d.toISOString()} date={d} selected={sameDay(d, value)} onSelect={onChange} />
        ))}
      </div>
    </div>
  )
}

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}
