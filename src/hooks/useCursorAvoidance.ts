import { useEffect, useRef, useState } from 'react'
import { useChaos } from './ChaosContext'

interface Options {
  /** distance in px at which the element starts fleeing */
  triggerRadius?: number
  /** max px it will move away */
  maxOffset?: number
  /** clamp the element to roughly stay within its parent bounds */
  bounded?: boolean
}

const LEVEL_MULTIPLIER = { off: 0, mild: 0.35, chaos: 1 } as const

// Makes the wrapped element skitter away from the cursor as it approaches,
// then spring back once the cursor moves off. Intensity is scaled by the
// global chaos level so it can be toned down to "still completable."
export function useCursorAvoidance<T extends HTMLElement = HTMLDivElement>(options: Options = {}) {
  const { triggerRadius = 140, maxOffset = 90, bounded = true } = options
  const { level } = useChaos()
  const ref = useRef<T | null>(null)
  const [transform, setTransform] = useState('translate(0px, 0px)')
  const frame = useRef<number | null>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const multiplier = LEVEL_MULTIPLIER[level]
    if (multiplier === 0) {
      setTransform('translate(0px, 0px)')
      return
    }

    function onMove(e: MouseEvent) {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = cx - e.clientX
      const dy = cy - e.clientY
      const dist = Math.hypot(dx, dy)

      if (dist < triggerRadius && dist > 0.01) {
        const strength = (1 - dist / triggerRadius) * maxOffset * multiplier
        let tx = (dx / dist) * strength
        let ty = (dy / dist) * strength

        if (bounded) {
          const parent = el.parentElement?.getBoundingClientRect()
          if (parent) {
            const maxX = Math.max(0, parent.width - rect.width) / 2
            const maxY = Math.max(0, parent.height - rect.height) / 2
            tx = Math.max(-maxX, Math.min(maxX, tx))
            ty = Math.max(-maxY, Math.min(maxY, ty))
          }
        }
        target.current = { x: tx, y: ty }
      } else {
        target.current = { x: 0, y: 0 }
      }
    }

    function tick() {
      current.current.x += (target.current.x - current.current.x) * 0.25
      current.current.y += (target.current.y - current.current.y) * 0.25
      setTransform(`translate(${current.current.x.toFixed(1)}px, ${current.current.y.toFixed(1)}px)`)
      frame.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    frame.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [level, triggerRadius, maxOffset, bounded])

  return { ref, style: { transform, transition: level === 'off' ? 'transform 0.2s' : undefined } }
}
