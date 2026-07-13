let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

// Hard safety ceiling regardless of the caller's requested volume/mute
// state — this can annoy, it should never be able to hurt ears.
const HARD_MAX_GAIN = 0.35

interface PlayOptions {
  volume: number
  muted: boolean
}

// A short burst of dissonant, detuned square-wave tones. Jarring on
// purpose, capped and stoppable on purpose too.
export function playAnnoyingChime({ volume, muted }: PlayOptions) {
  if (muted) return
  const audioCtx = getCtx()
  const gain = Math.min(Math.max(volume, 0), 1) * HARD_MAX_GAIN
  const now = audioCtx.currentTime

  const freqs = [880, 932, 1046, 622]
  freqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    osc.type = 'square'
    osc.frequency.value = freq
    const start = now + i * 0.09
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(gain, start + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.18)
    osc.connect(g)
    g.connect(audioCtx.destination)
    osc.start(start)
    osc.stop(start + 0.2)
  })
}
