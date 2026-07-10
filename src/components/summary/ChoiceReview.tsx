import type { ChoiceRecord } from '../../data/gameTypes'
import { formatDelta } from '../../utils/gameScore'

type ChoiceReviewProps = {
  records: ChoiceRecord[]
}

export function ChoiceReview({ records }: ChoiceReviewProps) {
  return (
    <ol className="choice-review">
      {records.map((record, index) => (
        <li key={`${record.sceneId}-${record.choiceId}`}>
          <span className="review-index">{index + 1}</span>
          <div>
            <strong>{record.sceneTitle}</strong>
            <p>{record.choiceLabel}</p>
            <small>
              信任 {formatDelta(record.trustDelta)} / 精力 {formatDelta(record.energyDelta)}
            </small>
            <em>{record.careTip}</em>
          </div>
        </li>
      ))}
    </ol>
  )
}
