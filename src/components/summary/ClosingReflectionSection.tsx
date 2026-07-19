import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { volunteerHighFrequencyChart } from '../../data/dataNewsContent'
import { InlineDataChart } from './InlineDataChart'

const reflectionLines = [
  { type: 'kicker', content: '主题收束' },
  { type: 'title', content: '照亮他人的人，谁来照亮他们？' },
  { type: 'body', content: '善意从来不是无限的。' },
  { type: 'body', content: '它需要被支持，被回应，被接住。' },
  { type: 'strong', content: '每一个照亮他人的人，也值得被世界温柔照亮。' },
] as const

export function ClosingReflectionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [revealState, setRevealState] = useState<'static' | 'waiting' | 'revealed'>('static')

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !('IntersectionObserver' in window)) return

    setRevealState('waiting')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setRevealState('revealed')
        observer.disconnect()
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`closing-reflection-section is-${revealState}`}
      aria-label="照亮他人的人，谁来照亮他们"
    >
      <div className="closing-reflection-section__glow" aria-hidden="true" />
      <div className="closing-reflection-section__layout">
        <div className="closing-reflection-section__copy">
          {reflectionLines.map((line, index) => {
            const style = { '--reveal-index': index } as CSSProperties
            if (line.type === 'kicker') {
              return <p key={line.content} className="summary-kicker closing-reflection-reveal" style={style}>{line.content}</p>
            }
            if (line.type === 'title') {
              return <h2 key={line.content} className="closing-reflection-reveal" style={style}>{line.content}</h2>
            }
            if (line.type === 'strong') {
              return <strong key={line.content} className="closing-reflection-reveal" style={style}>{line.content}</strong>
            }
            return <p key={line.content} className="closing-reflection-reveal" style={style}>{line.content}</p>
          })}
        </div>

        <InlineDataChart chart={volunteerHighFrequencyChart} className="inline-data-chart--closing" />
      </div>
    </section>
  )
}
