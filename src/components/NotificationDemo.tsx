import { useState } from 'react'
import { useChaos } from '../hooks/ChaosContext'
import { playAnnoyingChime } from '../utils/sound'

const CONFUSING_MESSAGES = [
  'Reminder: your event is happening (probably)',
  'This meeting starts in either 5 or 55 minutes',
  'You have 1 new event, or possibly 3',
  "Don't forget about the thing at the time",
  'Update: the meeting you forgot about already happened',
]

export function NotificationDemo() {
  const { soundVolume, soundMuted } = useChaos()
  const [messages, setMessages] = useState<string[]>([])

  function fire() {
    const msg = CONFUSING_MESSAGES[Math.floor(Math.random() * CONFUSING_MESSAGES.length)]
    setMessages((m) => [msg, ...m].slice(0, 5))
    playAnnoyingChime({ volume: soundVolume, muted: soundMuted })
  }

  return (
    <div className="notif-shell">
      <button onClick={fire}>Trigger a reminder</button>
      <ul className="notif-list">
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  )
}
