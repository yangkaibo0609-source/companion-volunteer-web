import { useState, type CSSProperties, type PointerEvent } from 'react'

type FlipPhotoCardProps = {
  src: string
  alt: string
  note?: string
  backText?: string
  className?: string
  tilt?: number
}

export function FlipPhotoCard({ src, alt, backText, className = '', tilt = -2 }: FlipPhotoCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const canFlip = Boolean(backText)

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 5
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -4
    setParallax({ x, y })
  }

  const resetParallax = () => setParallax({ x: 0, y: 0 })

  return (
    <button
      className={`flip-photo-card${flipped ? ' is-flipped' : ''}${canFlip ? ' can-flip' : ''} ${className}`}
      style={
        {
          '--photo-tilt': `${tilt}deg`,
          '--photo-rx': `${parallax.y}deg`,
          '--photo-ry': `${parallax.x}deg`,
        } as CSSProperties
      }
      type="button"
      aria-pressed={flipped}
      onClick={() => canFlip && setFlipped((value) => !value)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetParallax}
    >
      <span className="flip-photo-card__inner">
        <span className="flip-photo-card__face flip-photo-card__face--front">
          <span className="flip-photo-card__tape" aria-hidden="true" />
          <img src={src} alt={alt} />
        </span>
        {canFlip && (
          <span className="flip-photo-card__face flip-photo-card__face--back">
            <strong>{backText}</strong>
          </span>
        )}
      </span>
    </button>
  )
}
