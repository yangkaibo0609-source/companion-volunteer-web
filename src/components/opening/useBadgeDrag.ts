import { useCallback, useRef, useState } from 'react'

const DESKTOP_TRIGGER_DISTANCE = 150
const MOBILE_TRIGGER_DISTANCE = 110

export function useBadgeDrag(onTrigger: () => void) {
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const triggeredRef = useRef(false)
  const triggerDistance = window.innerWidth < 760 ? MOBILE_TRIGGER_DISTANCE : DESKTOP_TRIGGER_DISTANCE
  const progress = Math.min(1, dragY / triggerDistance)

  const trigger = useCallback(() => {
    if (triggeredRef.current) return
    triggeredRef.current = true
    setDragY(triggerDistance)
    window.setTimeout(onTrigger, 720)
  }, [onTrigger, triggerDistance])

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (triggeredRef.current) return
    event.currentTarget.setPointerCapture(event.pointerId)
    startYRef.current = event.clientY
    setIsDragging(true)
  }, [])

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isDragging || triggeredRef.current) return
      const nextDragY = Math.max(0, event.clientY - startYRef.current)
      setDragY(Math.min(triggerDistance + 30, nextDragY))
      if (nextDragY >= triggerDistance) trigger()
    },
    [isDragging, trigger, triggerDistance],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    if (!triggeredRef.current) setDragY(0)
  }, [])

  return {
    dragY,
    progress,
    isDragging,
    isTriggered: triggeredRef.current,
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
  }
}
