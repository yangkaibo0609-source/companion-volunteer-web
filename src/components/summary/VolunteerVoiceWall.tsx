import { useCallback, useEffect, useRef, useState } from 'react'
import { voiceGroups } from '../../data/investigationData'

function formatDuration(duration?: number) {
  if (!duration || !Number.isFinite(duration)) return '--:--'
  const minutes = Math.floor(duration / 60)
  return `${minutes}:${String(Math.round(duration % 60)).padStart(2, '0')}`
}

export function VolunteerVoiceWall() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const audioRefs = useRef(new Map<string, HTMLAudioElement>())
  const [activeId, setActiveId] = useState('')
  const [durations, setDurations] = useState<Record<string, number>>({})
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set())

  const pauseAll = useCallback((reset = true) => {
    audioRefs.current.forEach((audio) => {
      audio.pause()
      if (reset) audio.currentTime = 0
    })
    setActiveId('')
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) pauseAll()
    }, { threshold: 0.08 })
    observer.observe(section)

    const handleVisibility = () => {
      if (document.hidden) pauseAll()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      pauseAll()
    }
  }, [pauseAll])

  const toggleClip = async (clipId: string) => {
    const audio = audioRefs.current.get(clipId)
    if (!audio) return
    if (activeId === clipId && !audio.paused) {
      audio.pause()
      setActiveId('')
      return
    }

    pauseAll()
    try {
      await audio.play()
      setActiveId(clipId)
    } catch {
      setFailedIds((current) => new Set(current).add(clipId))
    }
  }

  return (
    <section ref={sectionRef} className="volunteer-voice-wall" aria-labelledby="volunteer-voice-title">
      <header className="investigation-heading investigation-heading--compact">
        <p className="summary-kicker">七组真实语音</p>
        <h2 id="volunteer-voice-title">听见他们自己的声音</h2>
        <p>点击语音条播放；新的语音会接替正在播放的内容。</p>
      </header>

      <div className="voice-portrait-grid">
        {voiceGroups.map((group) => (
          <article className="voice-portrait" key={group.id}>
            <div className="voice-portrait__identity">
              <img alt="" src={group.avatar} />
              <div><span>受访者 {group.id}</span><strong>{group.label}</strong></div>
            </div>
            <div className="voice-portrait__clips">
              {group.clips.map((clip, clipIndex) => {
                const isPlaying = activeId === clip.id
                const failed = failedIds.has(clip.id)
                return (
                  <div className="voice-clip" key={clip.id}>
                    {!failed && (
                      <button
                        aria-label={`${isPlaying ? '暂停' : '播放'}${group.label}第${clipIndex + 1}段语音`}
                        className={isPlaying ? 'is-playing' : ''}
                        onClick={() => void toggleClip(clip.id)}
                        type="button"
                      >
                        <span className="voice-clip__play" aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
                        <span className="voice-clip__waves" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                        <span>{formatDuration(durations[clip.id])}</span>
                      </button>
                    )}
                    <audio
                      className={failed ? 'voice-clip__fallback is-visible' : 'voice-clip__fallback'}
                      controls={failed}
                      onEnded={() => setActiveId('')}
                      onLoadedMetadata={(event) => {
                        const duration = event.currentTarget.duration
                        setDurations((current) => ({ ...current, [clip.id]: duration }))
                      }}
                      onPause={() => activeId === clip.id && setActiveId('')}
                      preload="metadata"
                      ref={(node) => {
                        if (node) audioRefs.current.set(clip.id, node)
                        else audioRefs.current.delete(clip.id)
                      }}
                      src={clip.src}
                    />
                  </div>
                )
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
