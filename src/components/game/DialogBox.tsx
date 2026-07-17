import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../../store/gameStore'

type DialogBoxProps = {
  speaker: string
  text: string
  canAdvance: boolean
  onNext: () => void
  showClickHint?: boolean
  onInteraction?: () => void
}

const TYPE_INTERVAL_MS = 28

export function DialogBox({ speaker, text, canAdvance, onNext, showClickHint = false, onInteraction }: DialogBoxProps) {
  const reducedMotion = useGameStore((state) => state.reducedMotion)
  const [visibleCount, setVisibleCount] = useState(text.length)
  const displayedText = useMemo(() => text.slice(0, visibleCount), [text, visibleCount])
  const isComplete = visibleCount >= text.length

  useEffect(() => {
    setVisibleCount(reducedMotion ? text.length : 0)
  }, [reducedMotion, text])

  useEffect(() => {
    if (reducedMotion || isComplete) return
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(text.length, count + 1))
    }, TYPE_INTERVAL_MS)

    return () => window.clearTimeout(timer)
  }, [isComplete, reducedMotion, text.length, visibleCount])

  function handleAdvance() {
    onInteraction?.()
    if (!isComplete) {
      setVisibleCount(text.length)
      return
    }

    if (canAdvance) onNext()
  }

  return (
    <button className="dialog-box" type="button" onClick={handleAdvance} aria-live="polite">
      <span className="dialog-speaker">{speaker}</span>
      <span className="dialog-text">{displayedText}</span>
      <span className="dialog-cue">{isComplete ? (canAdvance ? '继续' : '选择你的回应') : '展开'}</span>
      <span className={`game-click-hint${showClickHint ? '' : ' is-hidden'}`} aria-hidden="true">
        <i />
        <b>轻点继续</b>
      </span>
    </button>
  )
}
