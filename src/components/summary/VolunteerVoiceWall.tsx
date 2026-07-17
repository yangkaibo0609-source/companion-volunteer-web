import { useCallback, useEffect, useRef, useState } from 'react'
import { voiceGroups } from '../../data/investigationData'

type PlaybackState = {
  groupId: string
  clipIndex: number
  playing: boolean
}

const idlePlayback: PlaybackState = { groupId: '', clipIndex: 0, playing: false }

function formatDuration(duration?: number) {
  if (!duration || !Number.isFinite(duration)) return '--:--'
  const minutes = Math.floor(duration / 60)
  return `${minutes}:${String(Math.round(duration % 60)).padStart(2, '0')}`
}

export function VolunteerVoiceWall() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const audioRefs = useRef(new Map<string, HTMLAudioElement>())
  const [playback, setPlayback] = useState<PlaybackState>(idlePlayback)
  const [durations, setDurations] = useState<Record<string, number>>({})
  const [elapsedByGroup, setElapsedByGroup] = useState<Record<string, number>>({})
  const [failedGroups, setFailedGroups] = useState<Set<string>>(new Set())

  const pauseAll = useCallback((reset = true) => {
    audioRefs.current.forEach((audio) => {
      audio.pause()
      if (reset) audio.currentTime = 0
    })
    setPlayback(idlePlayback)
    if (reset) setElapsedByGroup({})
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

  const toggleGroup = async (group: (typeof voiceGroups)[number]) => {
    const sameGroup = playback.groupId === group.id
    let clipIndex = sameGroup ? playback.clipIndex : 0
    let audio = audioRefs.current.get(group.clips[clipIndex].id)
    if (!audio) return

    if (sameGroup && playback.playing && !audio.paused) {
      audio.pause()
      setPlayback((current) => ({ ...current, playing: false }))
      return
    }

    if (!sameGroup) {
      audioRefs.current.forEach((item) => {
        item.pause()
        item.currentTime = 0
      })
      setElapsedByGroup((current) => ({ ...current, [group.id]: 0 }))
    } else if (audio.ended) {
      group.clips.forEach((clip) => {
        const item = audioRefs.current.get(clip.id)
        if (item) item.currentTime = 0
      })
      clipIndex = 0
      audio = audioRefs.current.get(group.clips[0].id)
      if (!audio) return
      setElapsedByGroup((current) => ({ ...current, [group.id]: 0 }))
    }

    try {
      await audio.play()
      setPlayback({ groupId: group.id, clipIndex, playing: true })
    } catch {
      setFailedGroups((current) => new Set(current).add(group.id))
    }
  }

  return (
    <section ref={sectionRef} className="volunteer-voice-wall" aria-labelledby="volunteer-voice-title">
      <header className="investigation-heading investigation-heading--compact">
        <p className="summary-kicker">七组真实语音</p>
        <h2 id="volunteer-voice-title">听见他们自己的声音</h2>
        <p>每一张人物卡，保存一段完整讲述。</p>
      </header>

      <div className="voice-portrait-grid">
        {voiceGroups.map((group) => {
          const totalDuration = group.clips.reduce((total, clip) => total + (durations[clip.id] ?? 0), 0)
          const elapsed = elapsedByGroup[group.id] ?? 0
          const progress = totalDuration > 0 ? Math.min(elapsed / totalDuration, 1) : 0
          const isPlaying = playback.groupId === group.id && playback.playing
          const failed = failedGroups.has(group.id)

          return (
            <article className="voice-portrait" key={group.id}>
              <div className="voice-portrait__identity">
                <img alt="" src={group.avatar} />
                <div><span>受访者 {group.id}</span><strong>{group.label}</strong></div>
              </div>

              <div className="voice-portrait__clips">
                <div className="voice-clip">
                  <button
                    aria-label={`${isPlaying ? '暂停' : '播放'}${group.label}语音`}
                    className={isPlaying ? 'is-playing' : ''}
                    disabled={failed}
                    onClick={() => void toggleGroup(group)}
                    type="button"
                  >
                    <span className="voice-clip__play" aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
                    <span className="voice-clip__waves" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                    <span className="voice-clip__progress" aria-hidden="true"><i style={{ width: `${progress * 100}%` }} /></span>
                    <span className="voice-clip__duration">{failed ? '暂不可用' : formatDuration(totalDuration)}</span>
                  </button>

                  {group.clips.map((clip, clipIndex) => (
                    <audio
                      className="voice-sequence-audio"
                      key={clip.id}
                      onEnded={() => {
                        const nextClip = group.clips[clipIndex + 1]
                        if (!nextClip) {
                          setElapsedByGroup((current) => ({ ...current, [group.id]: totalDuration }))
                          setPlayback({ groupId: group.id, clipIndex, playing: false })
                          return
                        }

                        const nextAudio = audioRefs.current.get(nextClip.id)
                        if (!nextAudio) return
                        nextAudio.currentTime = 0
                        setPlayback({ groupId: group.id, clipIndex: clipIndex + 1, playing: true })
                        void nextAudio.play().catch(() => {
                          setFailedGroups((current) => new Set(current).add(group.id))
                          setPlayback({ groupId: group.id, clipIndex: clipIndex + 1, playing: false })
                        })
                      }}
                      onLoadedMetadata={(event) => {
                        const duration = event.currentTarget.duration
                        setDurations((current) => ({ ...current, [clip.id]: duration }))
                      }}
                      onTimeUpdate={(event) => {
                        const currentTime = event.currentTarget.currentTime
                        const precedingDuration = group.clips
                          .slice(0, clipIndex)
                          .reduce((total, precedingClip) => total + (durations[precedingClip.id] ?? 0), 0)
                        setElapsedByGroup((current) => ({
                          ...current,
                          [group.id]: precedingDuration + currentTime,
                        }))
                      }}
                      preload="metadata"
                      ref={(node) => {
                        if (node) audioRefs.current.set(clip.id, node)
                        else audioRefs.current.delete(clip.id)
                      }}
                      src={clip.src}
                    />
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
