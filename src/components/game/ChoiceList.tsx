import { useEffect } from 'react'
import type { ChoiceId, SceneChoice } from '../../data/gameTypes'

type ChoiceListProps = {
  choices: SceneChoice[]
  onSelect: (choiceId: ChoiceId) => void
  showGuide?: boolean
}

const keyMap: Record<string, ChoiceId> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' }

export function ChoiceList({ choices, onSelect, showGuide = false }: ChoiceListProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const choiceId = keyMap[event.key]
      if (choiceId) onSelect(choiceId)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSelect])

  return (
    <div className={`choice-list${showGuide ? ' has-guide' : ''}`} aria-label="选择回应">
      {showGuide && (
        <div className="choice-hand-guide" aria-hidden="true">
          <span className="choice-hand-guide__finger" data-direction="down">👇</span>
          <strong>点击下方选项，做出你的选择</strong>
        </div>
      )}
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          className={`choice-button choice-button--${choice.tone}`}
          type="button"
          onClick={() => onSelect(choice.id)}
        >
          <span className="choice-key">{index + 1}</span>
          <span className="choice-copy">{choice.label}</span>
        </button>
      ))}
    </div>
  )
}
