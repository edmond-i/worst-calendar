import { useState } from 'react'
import { ChaosProvider } from './hooks/ChaosContext'
import { CalendarGrid } from './components/CalendarGrid'
import { EventWizard } from './components/EventWizard'
import { RsvpPage } from './components/RsvpPage'
import { NotificationDemo } from './components/NotificationDemo'
import { SettingsPanel } from './components/SettingsPanel'
import './App.css'

const TABS = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'create', label: 'Create Event' },
  { id: 'rsvp', label: 'RSVP Demo' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'settings', label: 'Settings' },
] as const

type TabId = (typeof TABS)[number]['id']

function App() {
  const [tab, setTab] = useState<TabId>('calendar')

  return (
    <ChaosProvider>
      <div className="app-shell">
        <header className="app-header">
          <h1 className="app-title">
            <span className="title-piece a">Worst</span>
            <span className="title-piece b">Calendar</span>
          </h1>
          <nav className="app-nav">
            {TABS.map((t) => (
              <button key={t.id} className={tab === t.id ? 'nav-active' : ''} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="app-main">
          {tab === 'calendar' && <CalendarGrid />}
          {tab === 'create' && <EventWizard />}
          {tab === 'rsvp' && <RsvpPage />}
          {tab === 'notifications' && <NotificationDemo />}
          {tab === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </ChaosProvider>
  )
}

export default App
