import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from 'react'
import { interviewStories, type InterviewStory } from '../../data/interviewStories'

type InterviewTicketSectionProps = {
  sectionRef?: RefObject<HTMLElement | null>
}

type TicketLineProps = {
  selectedId: string
  onSelect: (storyId: string) => void
}

type TicketStageProps = {
  story: InterviewStory
  index: number
  total: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

function TicketTransition({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="ticket-transition-screen">
      <div className="ticket-transition-screen__copy">
        <p className="summary-kicker">访谈票根</p>
        <h2>数据之外，我们也听见了志愿者真实的讲述。</h2>
        <p>它能告诉我们规模、比例和困境，却说不完一次牵手、一首歌、一次拥抱，和一个人决定留下来的理由。</p>
        <button type="button" onClick={onEnter}>
          抽出一张故事票根
        </button>
      </div>
      <div className="ticket-transition-screen__edges" aria-hidden="true">
        {interviewStories.slice(0, 4).map((story, index) => (
          <span key={story.id} style={{ '--edge-index': index } as CSSProperties}>
            {story.title}
          </span>
        ))}
      </div>
    </div>
  )
}

const fanTransforms = [
  { x: 'clamp(-760px, -32vw, -590px)', y: 96, rotate: -14, z: 1 },
  { x: 'clamp(-470px, -20vw, -365px)', y: 56, rotate: -8, z: 2 },
  { x: 'clamp(-170px, -7vw, -122px)', y: 24, rotate: -3, z: 4 },
  { x: 'clamp(122px, 7vw, 170px)', y: 24, rotate: 3, z: 4 },
  { x: 'clamp(365px, 20vw, 470px)', y: 56, rotate: 8, z: 2 },
  { x: 'clamp(590px, 32vw, 760px)', y: 96, rotate: 14, z: 1 },
]

function FanTicket({
  story,
  index,
  selected,
  dimmed,
  onSelect,
}: {
  story: InterviewStory
  index: number
  selected: boolean
  dimmed: boolean
  onSelect: () => void
}) {
  const [dragPull, setDragPull] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startYRef = useRef<number | null>(null)
  const transform = fanTransforms[index] ?? { x: '0px', y: 0, rotate: 0, z: 1 }

  const endDrag = (shouldSelect: boolean) => {
    setDragging(false)
    setDragPull(0)
    startYRef.current = null
    if (shouldSelect) onSelect()
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    startYRef.current = event.clientY
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (startYRef.current == null) return
    const distance = Math.max(0, startYRef.current - event.clientY)
    setDragPull(Math.min(distance / 82, 1))
  }

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (startYRef.current == null) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    endDrag(true)
  }

  return (
    <article
      className={`hanging-ticket${selected ? ' is-selected' : ''}${dimmed ? ' is-dimmed' : ''}${dragging ? ' is-dragging' : ''}`}
      style={{
        '--ticket-index': index,
        '--fan-x': transform.x,
        '--fan-y': `${transform.y}px`,
        '--fan-rotate': `${transform.rotate}deg`,
        '--fan-z': transform.z,
        '--ticket-pull': dragPull,
        '--ticket-pull-y': `${dragPull * 112}px`,
        '--float-delay': `${index * -0.48}s`,
      } as CSSProperties}
    >
      <button
        className="hanging-ticket__button"
        type="button"
        onClick={() => {
          if (!dragging && dragPull <= 0.1) onSelect()
        }}
        onPointerCancel={() => endDrag(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        aria-label={`点击照片，查看《${story.title}》`}
        aria-pressed={selected}
      >
        <span className="hanging-ticket__clip" aria-hidden="true" />
        <span className="hanging-ticket__hint">点击照片试一试</span>
        <span className="hanging-ticket__media">
          <img src={story.image} alt={story.title} loading="lazy" />
        </span>
      </button>
    </article>
  )
}

function TicketFan({ selectedId, onSelect }: TicketLineProps) {
  return (
    <div className={`ticket-hanger${selectedId ? ' has-selection' : ''}`} aria-label="晾在绳上的访谈故事票根">
      {interviewStories.map((story, index) => (
        <FanTicket
          key={story.id}
          story={story}
          index={index}
          selected={story.id === selectedId}
          dimmed={Boolean(selectedId) && story.id !== selectedId}
          onSelect={() => onSelect(story.id)}
        />
      ))}
    </div>
  )
}

function TicketClothesline({ selectedId, onSelect }: TicketLineProps) {
  return (
    <div className={`ticket-clothesline${selectedId ? ' has-selection' : ''}`}>
      <div className="ticket-clothesline__rope" aria-hidden="true">
        <svg viewBox="0 0 1200 150" preserveAspectRatio="none" focusable="false">
          <path d="M 22 54 C 270 74 414 94 600 96 C 786 94 930 74 1178 54" />
          <path d="M 22 49 C 270 69 414 89 600 91 C 786 89 930 69 1178 49" />
        </svg>
        <span />
      </div>
      <TicketFan selectedId={selectedId} onSelect={onSelect} />
      <div className="ticket-clothesline__side-prompt" aria-hidden="true">
        <span className="ticket-clothesline__tap-mark" />
        <strong>点击照片试一试</strong>
      </div>
      <div className="ticket-clothesline__prompt" aria-hidden="true">
        <span>从照片里取下一个故事。</span>
      </div>
    </div>
  )
}

function TicketFullText({ story }: { story: InterviewStory }) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setExpanded(false)
  }, [story.id])

  return (
    <div className={`ticket-full-text${expanded ? ' is-expanded' : ''}`}>
      <button type="button" onClick={() => setExpanded((value) => !value)}>
        {expanded ? '收起完整故事' : '展开完整故事'}
      </button>
      <div className="ticket-full-text__body" aria-hidden={!expanded}>
        {story.fullText.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}

function TicketStoryBody({ story }: { story: InterviewStory }) {
  return (
    <div className="ticket-story-body">
      <p>{story.summary}</p>
      <div className="ticket-story-body__tags" aria-label="故事标签">
        {story.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <TicketFullText story={story} />
    </div>
  )
}

function TicketStoryAudio({ story }: { story: InterviewStory }) {
  return (
    <div className="ticket-story-audio">
      <strong>点击听有声故事</strong>
      <audio controls preload="metadata" src={story.audio} />
    </div>
  )
}

function TicketNavigation({ onClose, onNext, onPrevious }: Pick<TicketStageProps, 'onClose' | 'onNext' | 'onPrevious'>) {
  return (
    <nav className="ticket-navigation" aria-label="票根故事切换">
      <button type="button" onClick={onPrevious}>
        上一张
      </button>
      <button type="button" onClick={onNext}>
        下一张
      </button>
      <button className="ticket-navigation__close" type="button" onClick={onClose}>
        收起票根
      </button>
    </nav>
  )
}

function TicketStage({ story, index, total, onClose, onNext, onPrevious }: TicketStageProps) {
  return (
    <article className="ticket-stage" aria-label={`${story.title}故事展示台`}>
      <div className="ticket-stage__image">
        <img src={story.image} alt={story.title} loading="lazy" />
      </div>
      <span className="ticket-stage__perforation" aria-hidden="true" />
      <div className="ticket-stage__copy">
        <span className="ticket-stage__number">
          TICKET {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <h3>{story.title}</h3>
        <blockquote>{story.quote}</blockquote>
        <TicketStoryAudio story={story} />
        <TicketStoryBody story={story} />
        <TicketNavigation onClose={onClose} onNext={onNext} onPrevious={onPrevious} />
      </div>
    </article>
  )
}

export function InterviewTicketSection({ sectionRef }: InterviewTicketSectionProps) {
  const [selectedId, setSelectedId] = useState('')
  const wallRef = useRef<HTMLDivElement | null>(null)
  const selectedIndex = Math.max(
    0,
    interviewStories.findIndex((story) => story.id === selectedId),
  )
  const selectedStory = selectedId ? interviewStories[selectedIndex] : null

  const selectStory = (storyId: string) => {
    setSelectedId(storyId)
    window.setTimeout(() => {
      wallRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 40)
  }

  const closeStage = useCallback(() => setSelectedId(''), [])
  const showPrevious = useCallback(
    () => setSelectedId(interviewStories[(selectedIndex - 1 + interviewStories.length) % interviewStories.length].id),
    [selectedIndex],
  )
  const showNext = useCallback(
    () => setSelectedId(interviewStories[(selectedIndex + 1) % interviewStories.length].id),
    [selectedIndex],
  )
  const scrollToWall = () => wallRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })

  useEffect(() => {
    if (!selectedStory) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeStage()
      if (event.key === 'ArrowLeft') showPrevious()
      if (event.key === 'ArrowRight') showNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeStage, selectedStory, showNext, showPrevious])

  return (
    <section
      ref={sectionRef}
      className={`interview-ticket-section${selectedStory ? ' is-staged' : ''}`}
      aria-label="访谈票根"
    >
      <TicketTransition onEnter={scrollToWall} />

      <div ref={wallRef} className="interview-ticket-section__gallery">
        <TicketClothesline selectedId={selectedId} onSelect={selectStory} />
      </div>

      {selectedStory && (
        <div
          className="ticket-stage-layer"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeStage()
          }}
        >
          <TicketStage
            key={selectedStory.id}
            story={selectedStory}
            index={selectedIndex}
            total={interviewStories.length}
            onClose={closeStage}
            onNext={showNext}
            onPrevious={showPrevious}
          />
        </div>
      )}
    </section>
  )
}
