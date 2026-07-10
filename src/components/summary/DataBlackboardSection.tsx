import { Fragment, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'
import { dataBlackboardScenes, type BlackboardChart, type BlackboardMetric, type DataBlackboardScene as Scene } from '../../data/dataBlackboard'
import { dataSectionCovers, type SectionCoverAsset } from '../../data/sectionCovers'
import { SectionCover } from './SectionCover'

type DataBlackboardSectionProps = {
  sectionRef?: RefObject<HTMLElement | null>
}

function ChalkReveal({ lines, visible }: { lines: string[]; visible: boolean }) {
  return (
    <div className={`chalk-lines${visible ? ' is-visible' : ''}`}>
      {lines.map((line, index) => (
        <p key={line} style={{ '--line-index': index } as CSSProperties}>
          {line}
        </p>
      ))}
    </div>
  )
}

function ChalkMetric({
  metric,
  index,
  visible,
  selected,
  onSelect,
}: {
  metric: BlackboardMetric
  index: number
  visible: boolean
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      aria-pressed={selected}
      className={`chalk-metric${visible ? ' is-visible' : ''}${selected ? ' is-selected' : ''}`}
      onClick={onSelect}
      style={{ '--metric-index': index } as CSSProperties}
      type="button"
    >
      <strong>{metric.value}</strong>
      <span>{metric.label}</span>
    </button>
  )
}

function ChalkTimeline({ items, visible }: { items?: string[]; visible: boolean }) {
  if (!items?.length) return null

  return (
    <div className={`chalk-timeline${visible ? ' is-visible' : ''}`}>
      {items.map((item, index) => (
        <span key={item} style={{ '--time-index': index } as CSSProperties}>
          {item}
        </span>
      ))}
    </div>
  )
}

function ChartPullDown({ charts, visible }: { charts?: BlackboardChart[]; visible: boolean }) {
  const [openCharts, setOpenCharts] = useState<Set<string>>(() => new Set())

  if (!charts?.length) return null

  const toggleChart = (src: string) => {
    setOpenCharts((current) => {
      const next = new Set(current)
      if (next.has(src)) next.delete(src)
      else next.add(src)
      return next
    })
  }

  return (
    <div className={`chart-scrolls${visible ? ' is-visible' : ''}`}>
      {charts.map((chart) => (
        <article className={`chart-scroll${openCharts.has(chart.src) ? ' is-open' : ''}`} key={chart.src}>
          <div className="chart-scroll__head">
            <strong>{chart.title}</strong>
            <div>
              <button type="button" onClick={() => toggleChart(chart.src)}>
                {openCharts.has(chart.src) ? '收起图表' : '页面内展开'}
              </button>
              <a href={chart.src} target="_blank" rel="noreferrer">
                新窗口查看
              </a>
            </div>
          </div>
          {openCharts.has(chart.src) && (
            <div className="chart-scroll__paper">
              <iframe src={chart.src} title={chart.title} loading="lazy" />
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

function HangingBlackboard({
  scene,
  open,
  onToggle,
}: {
  scene: Scene
  open: boolean
  onToggle: () => void
}) {
  const [pull, setPull] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [settling, setSettling] = useState(false)
  const startYRef = useRef<number | null>(null)
  const movedRef = useRef(false)

  const triggerToggle = () => {
    setSettling(true)
    window.setTimeout(() => setSettling(false), 760)
    onToggle()
  }

  const releaseBoard = (shouldToggle: boolean) => {
    startYRef.current = null
    movedRef.current = false
    setDragging(false)
    setPull(0)
    if (shouldToggle) triggerToggle()
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    startYRef.current = event.clientY
    movedRef.current = false
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (startYRef.current == null) return
    const distance = Math.max(0, event.clientY - startYRef.current)
    if (distance > 4) movedRef.current = true
    const limit = open ? 58 : 92
    setPull(Math.min(distance / limit, 1))
  }

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (startYRef.current == null) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    releaseBoard(!movedRef.current || (!open && pull > 0.46) || (open && pull > 0.62))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    triggerToggle()
  }

  return (
    <button
      className={`data-blackboard${open ? ' is-open' : ''}${dragging ? ' is-dragging' : ''}${settling ? ' is-settling' : ''}${pull > 0.46 ? ' is-armed' : ''}`}
      style={{ '--board-pull': pull } as CSSProperties}
      type="button"
      onKeyDown={handleKeyDown}
      onPointerCancel={() => releaseBoard(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <span className="data-blackboard__ropes" aria-hidden="true" />
      <span className="data-blackboard__surface">
        <span className="data-blackboard__label">{scene.label}</span>
        <strong>{scene.question}</strong>
        <span className="data-blackboard__cue" aria-hidden="true">
          <i>点击</i>
          <b>☝</b>
        </span>
        <span className="data-blackboard__hint">{open ? '再次点击可收起黑板' : '轻点黑板，展开数据'}</span>
        <span className="data-blackboard__tray" aria-hidden="true" />
      </span>
    </button>
  )
}

function DataBlackboardScene({ scene }: { scene: Scene }) {
  const [open, setOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  return (
    <section id={`${scene.id}-blackboard`} className={`data-blackboard-scene data-blackboard-scene--${scene.id}${open ? ' is-open' : ''}`}>
      <div className="data-blackboard-scene__board">
        <HangingBlackboard scene={scene} open={open} onToggle={() => setOpen((value) => !value)} />
      </div>

      <div className="data-blackboard-scene__notes" aria-live="polite">
        <div className={`chalk-notes-paper${open ? ' is-visible' : ''}`}>
          <span className="chalk-notes-paper__pin" aria-hidden="true" />
          <ChalkReveal lines={scene.chalkLines} visible={open} />
          <div className={`chalk-metric-cluster${open ? ' is-visible' : ''}`}>
            {scene.metrics.map((metric, index) => (
              <ChalkMetric
                key={`${metric.value}${metric.label}`}
                metric={metric}
                index={index}
                selected={selectedMetric === `${metric.value}${metric.label}`}
                visible={open}
                onSelect={() => setSelectedMetric((current) => (current === `${metric.value}${metric.label}` ? null : `${metric.value}${metric.label}`))}
              />
            ))}
          </div>
          <ChalkTimeline items={scene.timeline} visible={open} />
          {scene.closing && <p className={`chalk-closing${open ? ' is-visible' : ''}`}>{scene.closing}</p>}
          <ChartPullDown charts={scene.charts} visible={open} />
        </div>
      </div>
    </section>
  )
}

export function DataBlackboardSection({ sectionRef }: DataBlackboardSectionProps) {
  const coverBeforeScene: Record<string, SectionCoverAsset | undefined> = {
    group: dataSectionCovers.group,
    time: dataSectionCovers.time,
    dilemma: dataSectionCovers.dilemma,
    echo: dataSectionCovers.echo,
  }

  return (
    <section ref={sectionRef} className="data-blackboard-section" aria-label="数据黑板">
      {dataBlackboardScenes.map((scene) => {
        const cover = coverBeforeScene[scene.id]
        return (
          <Fragment key={scene.id}>
            {cover && (
              <SectionCover
                ariaLabel={cover.ariaLabel}
                id={cover.id}
                image={cover.image}
                webpImage={cover.webpImage}
                nextSectionId={`${scene.id}-blackboard`}
              />
            )}
            <DataBlackboardScene scene={scene} />
          </Fragment>
        )
      })}
    </section>
  )
}
