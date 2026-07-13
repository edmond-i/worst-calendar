import { useState } from 'react'
import { HauntedInput } from './HauntedInput'
import { ChaosDatePicker } from './ChaosDatePicker'
import { chaoticDateLabel, confusingTimeLabel } from '../utils/dateChaos'

// The save button stays disabled until this exact word is typed into the
// unlabeled field below. There is no on-screen hint — check the console.
const SECRET_UNLOCK_WORD = 'pineapple'

type Step = 1 | 2 | 3

export function EventWizard() {
  const [step, setStep] = useState<Step>(1)
  const [title, setTitle] = useState('')
  const [mystery, setMystery] = useState('')
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const [confirmedWrongThing, setConfirmedWrongThing] = useState(false)
  const [saved, setSaved] = useState(false)

  console.info('%c[hint] the unlabeled field on step 1 wants a specific word.', 'color:gray')

  function goBack() {
    if (step === 2) {
      // Going back "helpfully" clears what you already typed.
      setTitle('')
      setMystery('')
    }
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s))
  }

  function goNext() {
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s))
  }

  function startOver() {
    setTitle('')
    setMystery('')
    setNotes('')
    setDate(new Date())
    setConfirmedWrongThing(false)
    setSaved(false)
    setStep(1)
  }

  // Requires the hidden unlock word AND the visibly-checked (but
  // misleadingly worded) confirmation box — one hidden obstacle, one
  // in-plain-sight one.
  const canSave = mystery.trim().toLowerCase() === SECRET_UNLOCK_WORD && confirmedWrongThing

  if (saved) {
    return (
      <div className="wizard-shell">
        <div className="wizard-summary">
          Event {title ? `"${title}"` : '(untitled)'} was saved — probably for {chaoticDateLabel(date)}, give or
          take. Check the calendar tab; it may or may not show up where you expect.
        </div>
        <button onClick={startOver}>Create another event</button>
      </div>
    )
  }

  return (
    <div className="wizard-shell">
      <div className="wizard-steps">Step {step} of 3</div>

      {step === 1 && (
        <div className="wizard-step">
          <label className="field-label">Event title</label>
          <HauntedInput ariaLabel="Event title" value={title} onChange={setTitle} placeholder="Title..." />

          <input
            className="unlabeled-field"
            aria-label="Required unlock field"
            placeholder="Field"
            value={mystery}
            onChange={(e) => setMystery(e.target.value)}
          />

          <button onClick={goNext}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-step">
          <ChaosDatePicker label="When is it?" value={date} onChange={setDate} />
          <label className="field-label">Notes</label>
          <HauntedInput ariaLabel="Notes" value={notes} onChange={setNotes} placeholder="Notes..." multiline />
          <div className="wizard-nav">
            <button onClick={goBack}>Back</button>
            <button onClick={goNext}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-step">
          <div className="wizard-summary">
            <div>
              <strong>Title:</strong> {chaoticDateLabel(date)}
            </div>
            <div>
              <strong>Date:</strong> {title || '(untitled)'}
            </div>
            <div>
              <strong>Time:</strong> {confusingTimeLabel(date)}
            </div>
          </div>

          <label className="confirm-row">
            <input
              type="checkbox"
              checked={confirmedWrongThing}
              onChange={(e) => setConfirmedWrongThing(e.target.checked)}
            />
            I confirm I want to permanently delete this event
          </label>

          <div className="wizard-nav">
            <button onClick={goBack}>Back</button>
            <button disabled={!canSave} title="" onClick={() => setSaved(true)}>
              Save event
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
