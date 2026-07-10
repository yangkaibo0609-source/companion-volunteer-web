import type { WheelEvent } from 'react'

type SectionCoverProps = {
  image: string
  webpImage: string
  id: string
  ariaLabel: string
  nextSectionId?: string
  eager?: boolean
  onAdvance?: () => void
}

export function SectionCover({ image, webpImage, id, ariaLabel, nextSectionId, eager = false, onAdvance }: SectionCoverProps) {
  const handleWheel = (event: WheelEvent<HTMLElement>) => {
    if (onAdvance && event.deltaY > 12) onAdvance()
  }

  return (
    <section
      id={id}
      className={`section-cover${onAdvance ? ' section-cover--interactive' : ''}`}
      aria-label={ariaLabel}
      onWheel={handleWheel}
    >
      <picture className="section-cover__picture">
        <source srcSet={webpImage} type="image/webp" />
        <img src={image} alt={ariaLabel} loading={eager ? 'eager' : 'lazy'} />
      </picture>
      {onAdvance ? (
        <button className="section-cover__advance" type="button" onClick={onAdvance}>
          <span aria-hidden="true">↓</span> 向下开始
        </button>
      ) : (
        <a className="section-cover__scroll-cue" href={nextSectionId ? `#${nextSectionId}` : undefined} aria-label={`继续浏览：${ariaLabel}`}>
          <span aria-hidden="true">↓</span>
        </a>
      )}
    </section>
  )
}
