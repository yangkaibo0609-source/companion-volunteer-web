import { useEffect, useMemo, useRef, useState } from 'react'
import { endingCopy } from '../../data/gameScript'
import { useGameStore } from '../../store/gameStore'
import { countTone, getEndingLevel } from '../../utils/gameScore'
import { ClosingReflectionSection } from './ClosingReflectionSection'
import { DataBlackboardSection } from './DataBlackboardSection'
import { InterviewTicketSection } from './InterviewTicketSection'
import { SummaryReview3D } from './SummaryReview3D'

type SummaryPageProps = {
  onRestart: () => void
}

type SummaryStage = 'scores' | 'review' | 'ending'
type ScoreTone = 'low' | 'mid' | 'high'

function getScoreTone(score: number): ScoreTone {
  if (score >= 80) return 'high'
  if (score >= 55) return 'mid'
  return 'low'
}

function useAnimatedNumber(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(active ? 0 : target)

  useEffect(() => {
    if (!active) {
      setValue(target)
      return
    }

    let frame = 0
    const startedAt = performance.now()

    function animate(now: number) {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    setValue(0)
    frame = window.requestAnimationFrame(animate)

    return () => window.cancelAnimationFrame(frame)
  }, [active, duration, target])

  return value
}

function useSummaryStage(reducedMotion: boolean) {
  const [stage, setStage] = useState<SummaryStage>('scores')

  useEffect(() => {
    if (stage !== 'scores') return

    const timeout = window.setTimeout(() => {
      setStage('review')
    }, reducedMotion ? 900 : 4300)

    return () => window.clearTimeout(timeout)
  }, [reducedMotion, stage])

  return [stage, setStage] as const
}

function ScoreCard({ label, value, animatedValue }: { label: string; value: number; animatedValue: number }) {
  const tone = getScoreTone(value)

  return (
    <article className={`summary-score-card summary-score-card--${tone}`}>
      <span>{label}</span>
      <strong>{animatedValue}</strong>
      <div className="score-meter" style={{ '--score': `${animatedValue}%` } as React.CSSProperties} />
    </article>
  )
}

export function SummaryPage({ onRestart }: SummaryPageProps) {
  const trust = useGameStore((state) => state.trust)
  const energy = useGameStore((state) => state.energy)
  const selectedChoices = useGameStore((state) => state.selectedChoices)
  const reducedMotion = useGameStore((state) => state.reducedMotion)
  const [stage, setStage] = useSummaryStage(reducedMotion)
  const dataBlackboardRef = useRef<HTMLElement | null>(null)

  const endingLevel = getEndingLevel(trust, energy)
  const ending = endingCopy[endingLevel]
  const observingCount = countTone(selectedChoices, 'observing')
  const forcefulCount = countTone(selectedChoices, 'forceful')
  const gentleCount = countTone(selectedChoices, 'gentle')
  const showScores = stage === 'scores'
  const animatedTrust = useAnimatedNumber(trust, showScores && !reducedMotion)
  const animatedEnergy = useAnimatedNumber(energy, showScores && !reducedMotion, 1500)

  const scoreLead = useMemo(() => {
    if (trust >= 80 && energy >= 60) return '你留住了关系，也照顾到了自己的精力。'
    if (trust >= 70) return '信任正在建立，接下来要继续看见自己的消耗。'
    if (energy < 45) return '今天的陪护消耗不低，方法和边界都值得复盘。'
    return '今天的判断有起伏，翻开每一张卡会更容易看见原因。'
  }, [energy, trust])

  const scrollToDataBlackboard = () => {
    dataBlackboardRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <main className={`summary-page summary-page--${stage}`}>
      {stage === 'scores' && (
        <section className="summary-score-stage" aria-label="结算分数">
          <div className="summary-stage-heading">
            <p className="summary-kicker">今日陪护结算</p>
            <h1>先看看你的信任值和精力值</h1>
            <p>{scoreLead}</p>
          </div>

          <div className="summary-grid summary-grid--scores">
            <ScoreCard label="信任值" value={trust} animatedValue={animatedTrust} />
            <ScoreCard label="精力值" value={energy} animatedValue={animatedEnergy} />
          </div>
        </section>
      )}

      {stage === 'review' && (
        <section className="summary-review-stage" aria-label="五幕抽卡回顾">
          <SummaryReview3D records={selectedChoices} reducedMotion={reducedMotion} onContinue={() => setStage('ending')} />
        </section>
      )}

      {stage === 'ending' && (
        <>
          <section className="summary-ending" aria-label="结算结束页">
            <div className="summary-ending-copy">
              <p className="summary-kicker">今日陪护记录</p>
              <h1>{ending.title}</h1>
              <p>{ending.body}</p>
              <small>{ending.note}</small>
              <p className="summary-transition-note">
                你完成了一天的陪伴。<br />
                但真实世界里的陪伴，不只发生一天。
              </p>
            </div>

            <div className="summary-ending-panel" aria-label="陪护倾向统计">
              <span>观察陪伴 {observingCount} 次</span>
              <span>温和引导 {gentleCount} 次</span>
              <span>直接介入 {forcefulCount} 次</span>
            </div>

            <div className="summary-ending-actions">
              <button className="secondary-action secondary-action--clickable" type="button" onClick={scrollToDataBlackboard}>
                继续看见数据背后的人
              </button>
              <button className="primary-action" type="button" onClick={onRestart}>
                再次体验
              </button>
            </div>
          </section>

          <DataBlackboardSection sectionRef={dataBlackboardRef} />
          <InterviewTicketSection />
          <ClosingReflectionSection />
        </>
      )}
    </main>
  )
}
