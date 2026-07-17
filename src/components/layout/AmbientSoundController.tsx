import { Howl } from 'howler'
import { useEffect, useRef } from 'react'
import backgroundMusic from '../../assets/audio/warm-window-light.mp3'
import { useGameStore } from '../../store/gameStore'

type ManagedAudio = {
  context: AudioContext
  masterGain: GainNode
}

function getAudioContextCtor() {
  return window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
}

function startChimeEngine(): ManagedAudio | null {
  const AudioContextCtor = getAudioContextCtor()
  if (!AudioContextCtor) return null

  const context = new AudioContextCtor()
  const masterGain = context.createGain()
  masterGain.gain.setValueAtTime(0.0001, context.currentTime)
  masterGain.gain.exponentialRampToValueAtTime(0.34, context.currentTime + 0.45)
  masterGain.connect(context.destination)
  void context.resume()
  return { context, masterGain }
}

function stopChimeEngine(audio: ManagedAudio | null) {
  if (!audio) return
  const { context, masterGain } = audio
  const now = context.currentTime
  masterGain.gain.cancelScheduledValues(now)
  masterGain.gain.setTargetAtTime(0.0001, now, 0.18)
  window.setTimeout(() => void context.close(), 520)
}

function playTextChime(audio: ManagedAudio | null, tone: 'line' | 'choice' | 'summary' = 'line') {
  if (!audio) return
  const { context, masterGain } = audio
  const now = context.currentTime
  const output = context.createGain()
  const filter = context.createBiquadFilter()
  const notes = tone === 'choice' ? [523.25, 659.25] : tone === 'summary' ? [392, 523.25, 659.25] : [440, 523.25]

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(2400, now)
  output.gain.setValueAtTime(0.0001, now)
  output.gain.exponentialRampToValueAtTime(tone === 'summary' ? 0.1 : 0.07, now + 0.04)
  output.gain.exponentialRampToValueAtTime(0.0001, now + 0.82)
  output.connect(filter)
  filter.connect(masterGain)

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.055)
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.045 + index * 0.055)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.62 + index * 0.06)
    oscillator.connect(gain)
    gain.connect(output)
    oscillator.start(now + index * 0.055)
    oscillator.stop(now + 0.88 + index * 0.06)
  })
}

export function AmbientSoundController() {
  const soundEnabled = useGameStore((state) => state.soundEnabled)
  const phase = useGameStore((state) => state.phase)
  const currentSceneIndex = useGameStore((state) => state.currentSceneIndex)
  const currentLineIndex = useGameStore((state) => state.currentLineIndex)
  const activeFeedback = useGameStore((state) => state.activeFeedback)
  const audioRef = useRef<ManagedAudio | null>(null)
  const musicRef = useRef<Howl | null>(null)
  const musicStopTimerRef = useRef<number | null>(null)
  const lastTextKey = useRef('')

  useEffect(() => {
    if (soundEnabled) {
      if (musicStopTimerRef.current) {
        window.clearTimeout(musicStopTimerRef.current)
        musicStopTimerRef.current = null
      }

      if (!musicRef.current) {
        const music = new Howl({ src: [backgroundMusic], html5: true, loop: true, volume: 0 })
        musicRef.current = music
        music.once('play', () => music.fade(0, 0.28, 900))
        music.play()
      }
      return
    }

    const music = musicRef.current
    if (!music) return
    musicRef.current = null
    music.fade(music.volume(), 0, 600)
    musicStopTimerRef.current = window.setTimeout(() => {
      music.stop()
      music.unload()
      musicStopTimerRef.current = null
    }, 650)
  }, [soundEnabled])

  useEffect(() => {
    if (soundEnabled && !audioRef.current) {
      audioRef.current = startChimeEngine()
      playTextChime(audioRef.current, 'summary')
    }

    if (!soundEnabled && audioRef.current) {
      const audio = audioRef.current
      audioRef.current = null
      stopChimeEngine(audio)
    }
  }, [soundEnabled])

  useEffect(() => {
    return () => {
      if (musicStopTimerRef.current) window.clearTimeout(musicStopTimerRef.current)
      if (musicRef.current) {
        musicRef.current.stop()
        musicRef.current.unload()
        musicRef.current = null
      }
      if (audioRef.current) {
        stopChimeEngine(audioRef.current)
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!soundEnabled) return
    const textKey = `${phase}-${currentSceneIndex}-${currentLineIndex}-${activeFeedback?.choiceId ?? 'none'}`
    if (textKey === lastTextKey.current) return
    lastTextKey.current = textKey
    playTextChime(audioRef.current, phase === 'feedback' ? 'choice' : phase === 'summary' ? 'summary' : 'line')
  }, [activeFeedback?.choiceId, currentLineIndex, currentSceneIndex, phase, soundEnabled])

  return null
}
