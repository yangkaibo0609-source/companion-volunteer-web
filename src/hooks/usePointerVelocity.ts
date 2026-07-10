import { useEffect, useRef } from 'react'
import { usePointerStore } from '../store/pointerStore'

export function usePointerVelocity() {
  const setPointer = usePointerStore((state) => state.setPointer)
  const lastRef = useRef({ x: 0, y: 0, time: performance.now() })
  const idleTimerRef = useRef<number | null>(null)
  const idleStartRef = useRef(performance.now())

  useEffect(() => {
    function clearIdleTimer() {
      if (idleTimerRef.current !== null) window.clearInterval(idleTimerRef.current)
      idleTimerRef.current = null
    }

    function startIdleTimer() {
      clearIdleTimer()
      idleStartRef.current = performance.now()
      idleTimerRef.current = window.setInterval(() => {
        const idleMs = performance.now() - idleStartRef.current
        setPointer({
          isIdle: idleMs > 600,
          idleMs,
        })
      }, 120)
    }

    function onPointerMove(event: PointerEvent) {
      const now = performance.now()
      const previous = lastRef.current
      const dx = event.clientX - previous.x
      const dy = event.clientY - previous.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const deltaTime = Math.max(16, now - previous.time)
      const speed = distance / deltaTime
      const pressureLevel = Math.max(0, Math.min(100, Math.round(speed * 90)))

      lastRef.current = { x: event.clientX, y: event.clientY, time: now }
      setPointer({
        x: event.clientX,
        y: event.clientY,
        speed,
        pressureLevel,
        isIdle: false,
        idleMs: 0,
      })
      startIdleTimer()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    startIdleTimer()

    return () => {
      clearIdleTimer()
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [setPointer])
}
