import { type CSSProperties, type RefObject, type ReactNode } from 'react'
import { volunteerStoryDeck, storyDeckAssets, type StoryDeckSlide } from '../data/volunteerStoryDeck'
import { FlipPhotoCard } from './FlipPhotoCard'
import '../styles/volunteer-story-deck.css'

type VolunteerStoryDeckProps = {
  sectionRef: RefObject<HTMLElement | null>
  onEnterVoices?: () => void
}

function GlassLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`story-glass-label ${className}`}>{children}</p>
}

function EditorialTitle({ lines }: { lines: string[] }) {
  return (
    <h2 className="story-editorial-title">
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h2>
  )
}

function EditorialLead({ lines }: { lines: string[] }) {
  return (
    <div className="story-editorial-lead">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}

function PillGroup({ tags, tone }: { tags?: string[]; tone: StoryDeckSlide['tone'] }) {
  if (!tags?.length) return null

  return (
    <div className={`story-pill-group story-pill-group--${tone}`} aria-label="关键词">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  )
}

function DataNote({ notes }: { notes?: StoryDeckSlide['dataNotes'] }) {
  if (!notes?.length) return null

  return (
    <div className="story-data-notes" aria-label="关键数据">
      {notes.map((note) => (
        <article key={note.label}>
          {note.value && <strong>{note.value}</strong>}
          <span>{note.label}</span>
        </article>
      ))}
    </div>
  )
}

function PhotoFrame({ slide, index }: { slide: StoryDeckSlide; index: number }) {
  const isCover = slide.tone === 'cover'

  return (
    <div className="story-photo-stack">
      <FlipPhotoCard
        src={slide.image}
        alt={slide.imageAlt}
        note={slide.imageNote}
        backText={slide.backText}
        className={isCover ? 'flip-photo-card--hero' : ''}
        tilt={isCover ? 1.5 : index % 2 === 0 ? -1.5 : 1.2}
      />
    </div>
  )
}

function StorySlide({
  slide,
  index,
  onEnterVoices,
}: {
  slide: StoryDeckSlide
  index: number
  onEnterVoices?: () => void
}) {
  const isVoice = slide.tone === 'voice'

  return (
    <section className={`story-slide story-slide--${slide.tone}`} aria-label={slide.eyebrow}>
      <div className="story-slide__canvas">
        <GlassLabel className="story-slide__label">
          <span>{slide.eyebrow}</span>
          <i aria-hidden="true">{String(index).padStart(2, '0')}</i>
        </GlassLabel>

        <div className="story-slide__photo">
          <PhotoFrame slide={slide} index={index} />
        </div>

        <div className="story-slide__copy">
          <EditorialTitle lines={slide.title} />
          <EditorialLead lines={slide.body} />
          <DataNote notes={slide.dataNotes} />
          <PillGroup tags={slide.tags} tone={slide.tone} />
          {isVoice && (
            <button className="story-voice-cta" type="button" onClick={onEnterVoices}>
              听见他们的声音
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export function VolunteerStoryDeck({ sectionRef, onEnterVoices }: VolunteerStoryDeckProps) {
  return (
    <section
      ref={sectionRef}
      className="volunteer-story-deck"
      style={{ '--story-bg': `url(${storyDeckAssets.watercolorBg})` } as CSSProperties}
      aria-label="照亮他人的人，谁来照亮他们？"
    >
      <div className="volunteer-story-deck__wash" aria-hidden="true" />
      {volunteerStoryDeck.map((slide, index) => (
        <StorySlide key={slide.id} slide={slide} index={index} onEnterVoices={onEnterVoices} />
      ))}
    </section>
  )
}
