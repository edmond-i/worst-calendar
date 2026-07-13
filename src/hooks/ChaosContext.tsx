import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'

export type ChaosLevel = 'off' | 'mild' | 'chaos'

interface ChaosSettings {
  level: ChaosLevel
  setLevel: (level: ChaosLevel) => void
  soundVolume: number
  setSoundVolume: (v: number) => void
  soundMuted: boolean
  setSoundMuted: (m: boolean) => void
}

const ChaosContext = createContext<ChaosSettings | null>(null)

// Real safety controls live alongside the joke settings: volume is capped
// and mutable at all times, regardless of chaos level.
export function ChaosProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<ChaosLevel>('mild')
  const [soundVolume, setSoundVolume] = useState(0.25)
  const [soundMuted, setSoundMuted] = useState(false)

  const value = useMemo(
    () => ({ level, setLevel, soundVolume, setSoundVolume, soundMuted, setSoundMuted }),
    [level, soundVolume, soundMuted]
  )

  return <ChaosContext.Provider value={value}>{children}</ChaosContext.Provider>
}

export function useChaos() {
  const ctx = useContext(ChaosContext)
  if (!ctx) throw new Error('useChaos must be used within ChaosProvider')
  return ctx
}
