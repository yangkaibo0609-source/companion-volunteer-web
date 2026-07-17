import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { investigationPhotos } from '../../data/investigationData'

const trackOrders = [
  [0, 1, 10, 8, 2, 3, 11, 4, 9, 5, 12, 6, 7],
  [4, 11, 5, 9, 6, 12, 7, 0, 10, 8, 1, 2, 3],
  [12, 9, 7, 6, 5, 11, 8, 4, 3, 10, 2, 1, 0],
]

export function VolunteerPhotoWall() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (selectedIndex == null) return
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setSelectedIndex(null)
      window.setTimeout(() => lastTriggerRef.current?.focus(), 0)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [selectedIndex])

  const closeLightbox = () => {
    setSelectedIndex(null)
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0)
  }

  return (
    <section className="volunteer-photo-wall" aria-labelledby="volunteer-photo-wall-title">
      <header className="investigation-heading">
        <p className="summary-kicker">现场记录</p>
        <h2 id="volunteer-photo-wall-title">志愿者的面孔从来不是单一的。</h2>
        <p>点击照片查看</p>
      </header>

      <div className="photo-wall-tracks">
        {trackOrders.map((order, trackIndex) => {
          const stream = [...order, ...order]
          return (
            <div
              className={`photo-wall-track photo-wall-track--${trackIndex + 1}`}
              key={trackIndex}
              style={{ '--track-index': trackIndex } as CSSProperties}
            >
              <div className="photo-wall-track__stream">
                {stream.map((photoIndex, copyIndex) => (
                  <button
                    aria-label={`查看${investigationPhotos[photoIndex].alt}`}
                    className="photo-wall-item"
                    key={`${photoIndex}-${copyIndex}`}
                    onClick={(event) => {
                      lastTriggerRef.current = event.currentTarget
                      setSelectedIndex(photoIndex)
                    }}
                    type="button"
                  >
                    <img alt={investigationPhotos[photoIndex].alt} loading="lazy" src={investigationPhotos[photoIndex].src} />
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selectedIndex != null && (
        <div className="photo-lightbox" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeLightbox()}>
          <figure role="dialog" aria-label={`现场照片 ${selectedIndex + 1}`} aria-modal="true">
            <img alt={investigationPhotos[selectedIndex].alt} src={investigationPhotos[selectedIndex].src} />
            <button autoFocus type="button" onClick={closeLightbox}>关闭照片</button>
          </figure>
        </div>
      )}
    </section>
  )
}
