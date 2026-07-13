import { useChaos } from '../hooks/ChaosContext'

// The one part of this app that behaves like a normal, trustworthy
// settings panel: real, immediate control over chaos intensity and sound.
export function SettingsPanel() {
  const { level, setLevel, soundVolume, setSoundVolume, soundMuted, setSoundMuted } = useChaos()

  return (
    <div className="settings-shell">
      <h2>Settings (this part is not a joke)</h2>

      <div className="settings-row">
        <span>Chaos intensity</span>
        <div className="settings-buttons">
          {(['off', 'mild', 'chaos'] as const).map((l) => (
            <button key={l} className={level === l ? 'active' : ''} onClick={() => setLevel(l)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-row">
        <span>Sound volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={soundVolume}
          onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
        />
      </div>

      <div className="settings-row">
        <label>
          <input type="checkbox" checked={soundMuted} onChange={(e) => setSoundMuted(e.target.checked)} />
          Mute sounds
        </label>
      </div>
    </div>
  )
}
