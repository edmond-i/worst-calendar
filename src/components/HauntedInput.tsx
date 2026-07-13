import { useEffect, useRef, useState } from 'react'
import { useChaos } from '../hooks/ChaosContext'
import { scramble } from '../utils/scramble'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
  ariaLabel: string
}

const SETTLE_DELAY_MS = 900

// The real value is always what's stored and submitted. While the user is
// actively typing, an overlay shows a scrambled decoy on top of a
// transparent-text input (the real input keeps normal cursor/selection
// behavior). SETTLE_DELAY_MS after the last keystroke, or on blur, the
// overlay reveals the true text.
export function HauntedInput({ value, onChange, placeholder, multiline, className, ariaLabel }: Props) {
  const { level } = useChaos()
  const [settled, setSettled] = useState(true)
  const [decoy, setDecoy] = useState('')
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (level === 'off') {
      setSettled(true)
      return
    }
    setDecoy(scramble(value))
  }, [value, level])

  function handleChange(v: string) {
    onChange(v)
    if (level === 'off') return
    setSettled(false)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSettled(true), SETTLE_DELAY_MS)
  }

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  const showDecoy = level !== 'off' && !settled && value.length > 0
  const sharedStyle = showDecoy ? { color: 'transparent', caretColor: '#111' } : undefined

  const Field = multiline ? 'textarea' : 'input'

  return (
    <div className="haunted-wrap">
      <Field
        aria-label={ariaLabel}
        className={`haunted-field ${className ?? ''}`}
        style={sharedStyle}
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setSettled(true)}
      />
      {showDecoy && (
        <div className="haunted-overlay" aria-hidden="true">
          {decoy || placeholder}
        </div>
      )}
    </div>
  )
}
