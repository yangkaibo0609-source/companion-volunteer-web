import { useMemo } from 'react'
import { usePointerStore } from '../../store/pointerStore'

export function PointerAura() {
  const x = usePointerStore((state) => state.x)
  const y = usePointerStore((state) => state.y)
  const speed = usePointerStore((state) => state.speed)
  const isIdle = usePointerStore((state) => state.isIdle)
  const pressureLevel = usePointerStore((state) => state.pressureLevel)

  const style = useMemo(
    () =>
      ({
        '--pointer-x': `${x}px`,
        '--pointer-y': `${y}px`,
        '--pointer-scale': isIdle ? 1.8 : Math.max(0.62, 1.45 - speed),
        '--pointer-pressure': pressureLevel / 100,
      }) as React.CSSProperties,
    [x, y, speed, isIdle, pressureLevel],
  )

  return <div className="pointer-aura" style={style} aria-hidden="true" />
}
