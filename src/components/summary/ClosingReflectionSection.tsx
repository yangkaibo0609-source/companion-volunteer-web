import { interviewStories } from '../../data/interviewStories'
import type { CSSProperties } from 'react'

export function ClosingReflectionSection() {
  return (
    <section className="closing-reflection-section" aria-label="照亮他人的人，谁来照亮他们">
      <div className="closing-reflection-section__glow" aria-hidden="true" />
      <div className="closing-reflection-section__tickets" aria-hidden="true">
        {interviewStories.slice(0, 4).map((story, index) => (
          <span key={story.id} style={{ '--float-index': index } as CSSProperties}>
            {story.title}
          </span>
        ))}
      </div>
      <div className="closing-reflection-section__copy">
        <p className="summary-kicker">主题收束</p>
        <h2>照亮他人的人，谁来照亮他们？</h2>
        <p>善意从来不是无限的。</p>
        <p>它需要被支持，被回应，被接住。</p>
        <strong>每一个照亮他人的人，也值得被世界温柔照亮。</strong>
      </div>
    </section>
  )
}
