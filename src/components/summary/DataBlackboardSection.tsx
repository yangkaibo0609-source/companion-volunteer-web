import { Fragment, useEffect, useState, type CSSProperties, type RefObject } from 'react'
import { dataBlackboardScenes, type BlackboardMetric, type DataBlackboardScene as Scene, type SourceParagraph as SourceParagraphData } from '../../data/dataBlackboard'
import { dataSectionCovers, type SectionCoverAsset } from '../../data/sectionCovers'
import { SectionCover } from './SectionCover'
import { InlineDataChart } from './InlineDataChart'
import { VolunteerMessageWall } from './VolunteerMessageWall'
import { VolunteerPhotoWall } from './VolunteerPhotoWall'
import { VolunteerVoiceWall } from './VolunteerVoiceWall'

type DataBlackboardSectionProps = {
  sectionRef?: RefObject<HTMLElement | null>
}

function SourceParagraph({ paragraph, index }: { paragraph: SourceParagraphData; index: number }) {
  return (
    <>
      {paragraph.segments.length > 0 && (
        <p style={{ '--line-index': index } as CSSProperties}>
          {paragraph.segments.map((segment, segmentIndex) => (
            <span className={segment.emphasis ? 'source-emphasis' : undefined} key={`${segment.text}-${segmentIndex}`}>
              {segment.text}
            </span>
          ))}
        </p>
      )}
      {paragraph.chart && <InlineDataChart chart={paragraph.chart} />}
    </>
  )
}

function ChalkReveal({ paragraphs, visible }: { paragraphs: SourceParagraphData[]; visible: boolean }) {
  return (
    <div className={`chalk-lines${visible ? ' is-visible' : ''}`}>
      {paragraphs.map((paragraph, index) => <SourceParagraph index={index} key={`${index}-${paragraph.segments.map((segment) => segment.text).join('')}`} paragraph={paragraph} />)}
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

function HangingBlackboard({ scene }: { scene: Scene }) {
  return (
    <div className="data-blackboard is-open is-static" aria-label={`${scene.label}：${scene.question}`}>
      <span className="data-blackboard__ropes" aria-hidden="true" />
      <span className="data-blackboard__surface">
        <span className="data-blackboard__label">{scene.label}</span>
        <strong>{scene.question}</strong>
        <span className="data-blackboard__tray" aria-hidden="true" />
      </span>
    </div>
  )
}

function DataBlackboardScene({ scene }: { scene: Scene }) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  return (
    <section id={`${scene.id}-blackboard`} className={`data-blackboard-scene data-blackboard-scene--${scene.id} is-open`}>
      <div className="data-blackboard-scene__board">
        <HangingBlackboard scene={scene} />
      </div>

      <div className="data-blackboard-scene__notes">
        <div className="chalk-notes-paper is-visible">
          <span className="chalk-notes-paper__pin" aria-hidden="true" />
          <ChalkReveal paragraphs={scene.paragraphs} visible />
          <div
            className="chalk-metric-cluster is-visible"
            style={{ '--metric-count': Math.min(scene.metrics.length, 4) } as CSSProperties}
          >
            {scene.metrics.map((metric, index) => (
              <ChalkMetric
                key={`${metric.value}${metric.label}`}
                metric={metric}
                index={index}
                selected={selectedMetric === `${metric.value}${metric.label}`}
                visible
                onSelect={() => setSelectedMetric((current) => (current === `${metric.value}${metric.label}` ? null : `${metric.value}${metric.label}`))}
              />
            ))}
          </div>
          {scene.postscript && (
            <section className="chalk-postscript" aria-label="时间的重量补充叙事">
              <InlineDataChart chart={scene.postscript.chart} className="inline-data-chart--time" />
              <div className="chalk-postscript__copy">
                {scene.postscript.paragraphs.map((text, index) => (
                  index === scene.postscript?.headingIndex
                    ? <h3 key={text}>{text}</h3>
                    : <p key={text}>{text}</p>
                ))}
              </div>
            </section>
          )}
          <ChalkTimeline items={scene.timeline} visible />
          {scene.closing && (
            <div className="chalk-closing is-visible">
              <SourceParagraph index={scene.paragraphs.length} paragraph={scene.closing} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function DataBlackboardSection({ sectionRef }: DataBlackboardSectionProps) {
  useEffect(() => {
    if (document.head.querySelector('[data-dycharts-preconnect]')) return

    const preconnect = document.createElement('link')
    preconnect.rel = 'preconnect'
    preconnect.href = 'https://dycharts.com'
    preconnect.crossOrigin = 'anonymous'
    preconnect.dataset.dychartsPreconnect = 'true'

    const dnsPrefetch = document.createElement('link')
    dnsPrefetch.rel = 'dns-prefetch'
    dnsPrefetch.href = 'https://dycharts.com'

    document.head.append(preconnect, dnsPrefetch)
  }, [])

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
            {scene.id === 'volunteers' && (
              <>
                <VolunteerPhotoWall />
                <VolunteerVoiceWall />
              </>
            )}
            {scene.id === 'time' && <VolunteerMessageWall />}
          </Fragment>
        )
      })}
    </section>
  )
}
