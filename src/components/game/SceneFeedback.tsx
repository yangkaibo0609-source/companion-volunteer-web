import type { ChoiceRecord } from '../../data/gameTypes'
import { formatDelta } from '../../utils/gameScore'

type SceneFeedbackProps = {
  record: ChoiceRecord
  onContinue: () => void
}

export function SceneFeedback({ record, onContinue }: SceneFeedbackProps) {
  return (
    <section className="scene-feedback" aria-live="polite">
      <div className="feedback-card">
        <p className="feedback-label">你的选择</p>
        <h2>{record.choiceLabel}</h2>
        <div className="feedback-deltas">
          <span className={record.trustDelta >= 0 ? 'delta-positive' : 'delta-negative'}>
            信任 {formatDelta(record.trustDelta)}
          </span>
          <span className={record.energyDelta >= 0 ? 'delta-neutral' : 'delta-negative'}>
            精力 {formatDelta(record.energyDelta)}
          </span>
        </div>
        <p>{record.result}</p>
        <small>{record.careTip}</small>
        <button className="primary-action" type="button" onClick={onContinue}>
          继续
        </button>
      </div>
    </section>
  )
}
