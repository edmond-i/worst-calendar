import { useState } from 'react'
import { ChaosDatePicker } from './ChaosDatePicker'
import { HauntedInput } from './HauntedInput'
import { chaoticDateLabel } from '../utils/dateChaos'

// Simulated locally only — nothing here sends a real email or reaches a
// real invitee. This exists purely to demo the "annoying RSVP" UX.
const FAKE_ORGANIZER = 'Alex Chen'
const FAKE_EVENT_TITLE = 'Quarterly Sync'

export function RsvpPage() {
  const [slot, setSlot] = useState(new Date())
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="rsvp-shell">
      <div className="rsvp-banner">
        (Local simulation — no real email was sent, no real invitee is involved)
      </div>
      <h2>You're invited: {FAKE_EVENT_TITLE}</h2>
      <p>From {FAKE_ORGANIZER} — pick a slot below.</p>

      <ChaosDatePicker label="Pick a slot that works" value={slot} onChange={setSlot} rangeDays={10} />

      <label className="field-label">Add a comment (optional)</label>
      <HauntedInput ariaLabel="RSVP comment" value={comment} onChange={setComment} placeholder="Looking forward to it..." multiline />

      {!submitted ? (
        <button onClick={() => setSubmitted(true)}>Send RSVP</button>
      ) : (
        <div className="rsvp-confirm">
          RSVP recorded for {chaoticDateLabel(slot)} (simulated — nothing was actually sent).
        </div>
      )}
    </div>
  )
}
