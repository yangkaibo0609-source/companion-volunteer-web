import { useEffect, useRef, useState, type CSSProperties } from 'react'

const revealLines: ReadonlyArray<{ tag: 'p' | 'h2' | 'strong'; className?: string; text: string }> = [
  { tag: 'p', className: 'summary-kicker', text: '主题收束' },
  { tag: 'h2', text: '照亮他人的人，谁来照亮他们？' },
  { tag: 'p', text: '善意从来不是无限的。' },
  { tag: 'p', text: '它需要被支持，被回应，被接住。' },
  { tag: 'strong', text: '每一个照亮他人的人，也值得被世界温柔照亮。' },
] as const

export function ClosingReflectionSection() {
  const copyRef = useRef<HTMLDivElement | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const copy = copyRef.current
    if (!copy || !('IntersectionObserver' in window)) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setIsRevealed(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.42 },
    )

    observer.observe(copy)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={`closing-reflection-section${isRevealed ? ' is-revealed' : ''}`} aria-label="照亮他人的人，谁来照亮他们">
      <div className="closing-reflection-section__glow" aria-hidden="true" />
      <div ref={copyRef} className="closing-reflection-section__copy">
        {revealLines.map((line, index) => {
          const Tag = line.tag
          return (
            <Tag
              className={`closing-reflection-reveal${line.className ? ` ${line.className}` : ''}`}
              key={line.text}
              style={{ '--reveal-index': index } as CSSProperties}
            >
              {line.text}
            </Tag>
          )
        })}
      </div>
    </section>
  )
}
